'use client'

import { fetchTaskAnswer } from '@/api/taskAnswerAPI'
import Comments from '@/components/teacher-student/comments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function TaskAnswer({ params }) {
    const [taskAnswer, setTaskAnswer] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTaskAnswer(params.id).then((data) => {
            setTaskAnswer(data)
            setLoading(false)
        })
    }, [])

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
                                <CardDescription>Оцінка: {taskAnswer.mark} / 12</CardDescription>
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
