'use client'

import { fetchTaskAnswer, updateTaskAnswerMark } from '@/api/taskAnswerAPI'
import Comments from '@/components/teacher-student/comments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { taskAnswerMarkSchema } from '@/schema/taskAnswerMarkSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function TaskAnswer({ params }) {
    const [taskAnswer, setTaskAnswer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const form = useForm({
        resolver: zodResolver(taskAnswerMarkSchema),
    })

    useEffect(() => {
        fetchTaskAnswer(params.id).then((data) => {
            setTaskAnswer(data)
            form.setValue('mark', data.mark)
            setLoading(false)
        })
    }, [])

    const onSubmit = async (values) => {
        setUploading(true)
        values.mark = parseInt(values.mark, 10)

        updateTaskAnswerMark(taskAnswer.id, values.mark)
            .then((data) => {
                toast.success('Оцінка успішно збережена')
                setTaskAnswer(data)
            })
            .catch((error) => {
                setError(error)
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
                                <CardTitle>
                                    Відповідь учня {taskAnswer.student.name} {taskAnswer.student.surname} {taskAnswer.student.patronymic}
                                </CardTitle>
                                <div className='flex items-center align-middle text-sm'>
                                    Оцінка:
                                    <Form {...form}>
                                        <form className='flex items-center align-middle' onSubmit={form.handleSubmit(onSubmit, onError)}>
                                            <FormField
                                                control={form.control}
                                                name='mark'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className='border-none h-8 w-16 ml-2 text-right'
                                                                type='number'
                                                                min='0'
                                                                max='12'
                                                                placeholder='0'
                                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || '')}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />{' '}
                                            / 12
                                            <Button type='submit' disabled={uploading} variant='ghost' className='ml-4 h-8 w-8 p-0'>
                                                {uploading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : <SaveIcon className='h-6 w-6' />}
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div dangerouslySetInnerHTML={createMarkup(taskAnswer.text)} />
                        </CardContent>
                    </Card>

                    {taskAnswer.filesCount > 0 && (
                        <Card className='w-full mb-4'>
                            <CardHeader>
                                <CardTitle>Зображення завантажені учнем</CardTitle>
                            </CardHeader>

                            <CardContent className='grid grid-cols-1 items-center justify-center align-middle gap-4'>
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
                                                    onClick={() => handleImageClick(index)}
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

                    <Comments taskAnswerId={parseInt(params.id)} />

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className='p-0'>
                                <div className=''>
                                    <Image
                                        className='rounded-lg'
                                        loader={imageKitLoader}
                                        src={'task-answer/' + taskAnswer.id + '_' + (selectedImageIndex + 1)}
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
