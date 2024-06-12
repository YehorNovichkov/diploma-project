'use client'

import { fetchTask } from '@/api/taskAPI'
import { createTaskAnswer, fetchTaskAnswerByTaskAndStudent, updateTaskAnswerFilesCount } from '@/api/taskAnswerAPI'
import { useAppContext } from '@/components/context/appWrapper'
import Comments from '@/components/teacher-student/comments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import Tiptap from '@/components/ui/tiptap'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { taskAnswerSchema } from '@/schema/taskAnswerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { IKUpload } from 'imagekitio-react'
import { Loader2Icon, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function TaskDetails({ params }) {
    const { userStore } = useAppContext()
    const ikUploadRef = useRef(null)
    const [task, setTask] = useState(null)
    const [taskAnswer, setTaskAnswer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [uploading, setUploading] = useState(false)

    const form = useForm({
        resolver: zodResolver(taskAnswerSchema),
        defaultValues: {
            text: '',
        },
    })

    useEffect(() => {
        fetchTask(params.id).then((data) => {
            setTask(data)
        })

        fetchTaskAnswerByTaskAndStudent(params.id, userStore.user.id).then((data) => {
            setTaskAnswer(data)
            form.reset()
            setLoading(false)
        })
    }, [])

    const handleUploadError = (error) => {
        toast.error('Помилка завантаження зображення')
        console.log(error)
    }

    const handleUploadSuccess = (response) => {
        toast.success('Зображення успішно завантажено')
        updateTaskAnswerFilesCount(taskAnswer.id, parseInt(taskAnswer.filesCount) + 1).then((data) => {
            setTaskAnswer(data)
        })
    }

    const onSubmit = async (values) => {
        setUploading(true)

        await createTaskAnswer(values.text, params.id, userStore.user.id)
            .then((data) => {
                form.reset()
                setTaskAnswer(data)
            })
            .catch((e) => {
                setError(e)
            })
            .finally(() => {
                setUploading(false)
            })
    }

    const onError = (error) => {
        console.log(error)
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [selectedImageSource, setSelectedImageSource] = useState(null)

    const handleImageClick = (source, index) => {
        setSelectedImageSource(source)
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

                    {task.filesCount > 0 && (
                        <Card className='w-full mb-4'>
                            <CardHeader>
                                <CardTitle>Зображення</CardTitle>
                            </CardHeader>
                            <CardContent className='grid grid-cols-1 items-center justify-center align-middle gap-4'>
                                <Carousel className='w-full max-w-xs justify-self-center'>
                                    <CarouselContent className='align-middle items-center'>
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
                                                    priority={false}
                                                    quality={50}
                                                    placeholder='empty'
                                                    onClick={() => handleImageClick('task', index)}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </CardContent>
                        </Card>
                    )}

                    <Separator className='mb-4' />

                    <Card className='w-full mb-4'>
                        <CardHeader>
                            <CardTitle>Твоя відповідь</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {taskAnswer ? (
                                <>
                                    <div dangerouslySetInnerHTML={createMarkup(taskAnswer.text)} />
                                </>
                            ) : (
                                <Form {...form}>
                                    <form className='grid gap-4 py-4 items-center' onSubmit={form.handleSubmit(onSubmit, onError)}>
                                        <FormField
                                            control={form.control}
                                            name='text'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Текст твоєї відповіді</FormLabel>
                                                    <FormControl>
                                                        <Tiptap value={field.value} onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type='submit' disabled={uploading}>
                                            {uploading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Зберегти'}
                                        </Button>
                                        {error && <FormMessage type='error'>Сталася помилка ({error.message})</FormMessage>}
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>

                    {taskAnswer && (
                        <>
                            <Card className='w-full mb-4'>
                                <CardHeader>
                                    <CardTitle>Твої зображення</CardTitle>
                                </CardHeader>

                                <CardContent className='grid grid-cols-1 items-center justify-center align-middle gap-4'>
                                    {taskAnswer.filesCount > 0 && (
                                        <Carousel className='w-full max-w-xs justify-self-center'>
                                            <CarouselContent className='align-middle items-center'>
                                                {[...Array(parseInt(taskAnswer.filesCount))].map((_, index) => (
                                                    <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                                                        <Image
                                                            className='rounded-lg hover:cursor-pointer'
                                                            loader={imageKitLoader}
                                                            src={'task-answer/' + taskAnswer.id + '_' + (index + 1)}
                                                            alt={'Зображення відповіді ' + (index + 1)}
                                                            width={200}
                                                            height={200}
                                                            loading='lazy'
                                                            lqip={{ active: true }}
                                                            priority={false}
                                                            quality={50}
                                                            placeholder='empty'
                                                            onClick={() => handleImageClick('task-answer', index)}
                                                        />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                    )}

                                    <IKUpload
                                        fileName={taskAnswer.id + '_' + (parseInt(taskAnswer.filesCount) + 1)}
                                        folder={'/task-answer'}
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
                            <Comments taskAnswerId={parseInt(taskAnswer.id)} />
                        </>
                    )}

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className='p-0'>
                                <div className=''>
                                    <Image
                                        className='rounded-lg'
                                        loader={imageKitLoader}
                                        src={
                                            selectedImageSource +
                                            '/' +
                                            (selectedImageSource === 'task' ? task.id : taskAnswer.id) +
                                            '_' +
                                            (selectedImageIndex + 1)
                                        }
                                        alt={'Зображення ' + (selectedImageIndex + 1)}
                                        width={1000}
                                        height={1000}
                                        loading='lazy'
                                        lqip={{ active: true }}
                                        priority={false}
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
