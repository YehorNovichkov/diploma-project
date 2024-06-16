'use client'

import { fetchTaskAnswersByTask } from '@/api/taskAnswerAPI'
import { fetchTask, updateTaskFilesCount } from '@/api/taskAPI'
import { EditTaskDialog } from '@/components/teacher/editTaskDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { IKUpload } from 'imagekitio-react'
import { Loader2Icon, PlusCircle, SquareXIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function TaskDetails({ params }) {
    const router = useRouter()
    const ikUploadRef = useRef(null)
    const [task, setTask] = useState(null)
    const [answers, setAnswers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchTask(params.id).then((data) => {
            setTask(data)
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
                                    <span className='text-sm text-muted-foreground ml-2'>
                                        {format(toZonedTime(new Date(task.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                    </span>
                                </div>
                            </div>

                            <CardDescription>
                                {task.class.name} • {task.subject.name} • Дедлайн:{' '}
                                {format(toZonedTime(new Date(task.deadline), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')} ({getTimeUntilDeadline(task.deadline)})
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
                    <div className='text-2xl font-semibold mb-4'>Відповіді</div>
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
                                                <>
                                                    <SquareXIcon className='w-2 h-2' /> Не оцінено
                                                </>
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
