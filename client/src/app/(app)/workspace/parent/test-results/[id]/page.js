'use client'

import { fetchTestResult } from '@/api/testResultAPI'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function TestResultDetails({ params }) {
    const [loading, setLoading] = useState(true)
    const [test, setTest] = useState(null)
    const [testResult, setTestResult] = useState(null)
    const [questionIds, setQuestionIds] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [answers, setAnswers] = useState([])

    useEffect(() => {
        fetchTestResult(params.id).then((data) => {
            setTestResult(data)
            setTest(data.test)
            setQuestionIds(data.test.questions.map((question) => ({ id: question.id })))
            setLoading(false)
        })
    }, [params.id])

    const handleQuestionClick = (questionId) => {
        const question = test.questions.find((question) => question.id === questionId)
        setSelectedQuestion(question)

        const answers = testResult.answers.filter((answer) => answer.questionId === questionId)
        setAnswers(answers)
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
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className='flex justify-between items-center align-middle'>
                                    <CardTitle>{test.name}</CardTitle>
                                    <span className='text-sm text-muted-foreground ml-2'>
                                        {format(toZonedTime(new Date(test.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                    </span>
                                </div>

                                <CardDescription>
                                    {test.class.name} • {test.subject.name} • Ліміт часу: {test.timeLimit} хв • Дедлайн:{' '}
                                    {format(toZonedTime(new Date(test.deadline), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')} ({getTimeUntilDeadline(test.deadline)})
                                </CardDescription>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className='mt-4'>
                        <CardHeader>
                            <CardTitle>
                                Результат дитини: {(testResult.mark * 100).toFixed(2)}% ({(testResult.mark * 12).toFixed(0)})
                            </CardTitle>
                            <CardDescription>
                                Дата та час початку: {format(toZonedTime(new Date(testResult.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                <br />
                                Дата та час завершення: {format(toZonedTime(new Date(testResult.completedAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                <br />
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <div className='flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4'>
                        <div className='flex-1 space-y-2'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Питання</CardTitle>
                                    <CardDescription>
                                        {selectedQuestion && selectedQuestion.isManual && <p>Питання передбачає ручну відповідь</p>}
                                        {selectedQuestion && (
                                            <p>Відповідь дано: {format(toZonedTime(new Date(answers[0].createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}</p>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {selectedQuestion ? (
                                        <>
                                            <div className='text-lg' dangerouslySetInnerHTML={createMarkup(selectedQuestion.text)} />
                                            <Separator className='mt-3' />
                                            <h5 className='mt-4 mb-2 text-lg font-medium'>Відповідь(-і):</h5>
                                            {selectedQuestion.isManual ? (
                                                <div
                                                    className={cn('border rounded-md p-2 pl-4 w-full', {
                                                        'border-green-700': answers[0].question.testAnswers.some(
                                                            (testAnswer) =>
                                                                testAnswer.text.trim().toLowerCase() === answers[0].manualAnswer.trim().toLowerCase()
                                                        ),
                                                        'border-red-700': !answers[0].question.testAnswers.some(
                                                            (testAnswer) =>
                                                                testAnswer.text.trim().toLowerCase() === answers[0].manualAnswer.trim().toLowerCase()
                                                        ),
                                                    })}>
                                                    {answers[0].manualAnswer}
                                                </div>
                                            ) : (
                                                answers.map((answer) => (
                                                    <div
                                                        key={answer.id}
                                                        className={cn('border rounded-md p-2 pl-4 w-full mb-2', {
                                                            'border-green-700': answer.answer.isCorrect,
                                                            'border-red-700': !answer.answer.isCorrect,
                                                        })}>
                                                        {answer.answer.text}
                                                    </div>
                                                ))
                                            )}
                                        </>
                                    ) : (
                                        <p className='text-muted-foreground'>Оберіть питання зі списку, щоб побачити його деталі та відповіді.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {selectedQuestion && selectedQuestion.filesCount > 0 && (
                                <Card className='w-full'>
                                    <CardHeader>
                                        <CardTitle>Зображення</CardTitle>
                                    </CardHeader>
                                    <CardContent className='grid grid-cols-1 items-center align-middle gap-4'>
                                        <Carousel className='w-fit max-w-xs justify-self-center'>
                                            <CarouselContent className='items-center'>
                                                {[...Array(parseInt(selectedQuestion.filesCount))].map((_, index) => (
                                                    <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                                                        <Image
                                                            className='rounded-lg hover:cursor-pointer'
                                                            loader={imageKitLoader}
                                                            src={'test-question/' + selectedQuestion.id + '_' + (index + 1)}
                                                            alt={'Зображення запитання тесту ' + (index + 1)}
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
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <Card className='w-full md:w-1/4'>
                            <CardHeader>
                                <CardTitle>Список питань</CardTitle>
                            </CardHeader>
                            <CardContent className='grid grid-flow-row-dense auto-rows-max grid-cols-4 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2'>
                                {questionIds.map((questionItem, index) => (
                                    <Button
                                        variant='ghost'
                                        className={cn({ 'bg-secondary': selectedQuestion?.id === questionItem.id })}
                                        key={questionItem.id}
                                        onClick={() => handleQuestionClick(questionItem.id)}>
                                        {index + 1}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {isDialogOpen && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className='p-0'>
                                <div className=''>
                                    <Image
                                        className='rounded-lg'
                                        loader={imageKitLoader}
                                        src={'test-question/' + selectedQuestion.id + '_' + (selectedImageIndex + 1)}
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
