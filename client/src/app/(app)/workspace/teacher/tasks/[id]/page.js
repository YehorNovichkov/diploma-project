'use client'

import { fetchTaskAnswersByTask } from '@/api/taskAnswerAPI'
import { deleteTask, fetchTask, updateHiddenTask, updateTaskFilesCount } from '@/api/taskAPI'
import { EditTaskDialog } from '@/components/teacher/editTaskDialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { IKUpload } from 'imagekitio-react'
import { debounce } from 'lodash'
import { Loader2Icon, PlusCircle, SquareXIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function TaskDetails({ params }) {
    const router = useRouter()
    const ikUploadRef = useRef(null)
    const [task, setTask] = useState(null)
    const [answers, setAnswers] = useState([])
    const [hidden, setHidden] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchTask(params.id).then((data) => {
            setTask(data)
            setHidden(data.hidden)
        })
        fetchTaskAnswersByTask(params.id).then((data) => {
            setAnswers(data)
            setLoading(false)
        })
    }, [])

    const handleUploadError = (error) => {
        toast.error('Помилка завантаження зображення')
        console.log(error)
    }

    const handleUploadSuccess = (response) => {
        toast.success('Зображення успішно завантажено')
        setLoading(true)
        updateTaskFilesCount(params.id, parseInt(task.filesCount) + 1).then((data) => {
            setTask(data)
            setLoading(false)
        })
    }

    const handleHiddenChange = debounce(() => {
        updateHiddenTask(task.id, !hidden).then(() => {
            const prevHidden = hidden
            setHidden(!prevHidden)
            toast.success(`Завдання ${!prevHidden ? 'приховано' : 'відкрито'}`)
        })
    }, 200)

    const handleTaskDelete = async (id) => {
        deleteTask(id).then(() => {
            router.push('/workspace/teacher/tasks')
        })
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const handleImageClick = (index) => {
        setSelectedImageIndex(index)
        setIsDialogOpen(true)
    }

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader2Icon className='w-10 h-10 animate-spin' />
                </div>
            ) : (
                <div className='p-6 lg:p-12'>
                    <Card className='w-full mb-4'>
                        <CardHeader>
                            <div className='flex justify-between items-center align-middle'>
                                <CardTitle>{task.name}</CardTitle>
                                <div className='flex'>
                                    <EditTaskDialog task={task} setTask={setTask} />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className='ml-1 h-6'>
                                                <Trash2Icon className='h-4' />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Ви впевнені що хочете видалити це завдання?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Ця дія незворотня! Видалення завдання призведе до видалення всіх даних, пов'язаних з ним.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleTaskDelete(params.id)}>Видалити</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <span className='text-sm text-muted-foreground ml-2'>
                                        {format(toZonedTime(new Date(task.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                    </span>
                                </div>
                            </div>

                            <CardDescription>
                                {task.class.name} • {task.subject.name} • Дедлайн:{' '}
                                {format(toZonedTime(new Date(task.deadline), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')} ({getTimeUntilDeadline(task.deadline)})
                                <div className='flex items-center space-x-2 mt-2'>
                                    <Label htmlFor='hidden'>Приховане: </Label>
                                    <Switch id='hidden' checked={hidden} onCheckedChange={handleHiddenChange} />
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div dangerouslySetInnerHTML={createMarkup(task.description)} />
                        </CardContent>
                    </Card>

                    <Card className='w-full mb-4'>
                        <CardHeader>
                            <CardTitle>Зображення</CardTitle>
                        </CardHeader>
                        <CardContent className='grid grid-cols-1 items-center align-middle gap-4'>
                            {task.filesCount > 0 && (
                                <Carousel className='w-fit max-w-xs justify-self-center'>
                                    <CarouselContent className='items-center'>
                                        {[...Array(parseInt(task.filesCount))].map((_, index) => (
                                            <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                                                <Image
                                                    className='rounded-lg hover:cursor-pointer'
                                                    loader={imageKitLoader}
                                                    src={'task/' + task.id + '_' + (index + 1)}
                                                    alt={'Зображення завдання ' + (index + 1)}
                                                    width={200}
                                                    height={200}
                                                    loading='lazy'
                                                    lqip={{ active: true }}
                                                    quality={50}
                                                    placeholder='empty'
                                                    onClick={() => handleImageClick(index)}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            )}

                            <IKUpload
                                fileName={task.id + '_' + (parseInt(task.filesCount) + 1)}
                                folder={'/task'}
                                validateFile={(file) => file.size < 20000000}
                                useUniqueFileName={false}
                                style={{ display: 'none' }}
                                ref={ikUploadRef}
                                onError={handleUploadError}
                                onSuccess={handleUploadSuccess}
                            />
                            <Button variant='outline' onClick={() => ikUploadRef.current.click()}>
                                <PlusCircle />
                            </Button>
                        </CardContent>
                    </Card>

                    <Separator className='mb-4' />
                    <div className='text-2xl font-semibold mb-4'>Відповіді учнів:</div>
                    {answers.length > 0 ? (
                        answers.map((answer) => (
                            <Card
                                key={answer.id}
                                className='w-full mb-2 cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                onClick={() => {
                                    router.push(`/workspace/teacher/task-answer/${answer.id}`)
                                }}>
                                <CardHeader className='p-4'>
                                    <div>
                                        <div className='flex justify-between items-center align-middle'>
                                            <CardTitle className='text-lg font-normal'>
                                                {answer.student.name} {answer.student.surname} {answer.student.patronymic}
                                            </CardTitle>
                                            <span className='text-sm text-muted-foreground'>
                                                {format(toZonedTime(new Date(answer.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                            </span>
                                        </div>
                                        <CardDescription>
                                            {answer.mark ? (
                                                <>Оцінка: {answer.mark}/12</>
                                            ) : (
                                                <div className='flex items-center'>
                                                    <SquareXIcon className='w-5 h-5 mr-2' />
                                                    <p>Не оцінено</p>
                                                </div>
                                            )}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    ) : (
                        <div className='text-muted-foreground'>Немає відповідей</div>
                    )}

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className='p-0'>
                                <div className=''>
                                    <Image
                                        className='rounded-lg'
                                        loader={imageKitLoader}
                                        src={'task/' + task.id + '_' + (selectedImageIndex + 1)}
                                        alt={'Зображення завдання ' + (selectedImageIndex + 1)}
                                        width={1000}
                                        height={1000}
                                        loading='lazy'
                                        lqip={{ active: true }}
                                        quality={95}
                                        placeholder='empty'
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            )}
        </main>
    )
}
