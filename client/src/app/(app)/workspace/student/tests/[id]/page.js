'use client'

import { createStudentTestAnswer, fetchStudentTestAnswersByResultIdQuestionId } from '@/api/studentTestAnswerAPI'
import { fetchTestAnswersByTestQuestionId } from '@/api/testAnswerAPI'
import { fetchTest } from '@/api/testAPI'
import { fetchTestQuestion, fetchTestQuestionIdsByTestId } from '@/api/testQuestionAPI'
import { completeTestResult, createTestResult, fetchTestResultByStudentIdTestId } from '@/api/testResultAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { cn } from '@/lib/utils'
import { studentTestAnswerSchema } from '@/schema/studentTestAnswerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { addMilliseconds, differenceInMilliseconds, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function TestDetails({ params }) {
    const { userStore } = useAppContext()
    const [loading, setLoading] = useState(true)
    const [test, setTest] = useState(null)
    const [questionIds, setQuestionIds] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [answers, setAnswers] = useState([])
    const [studentAnswers, setStudentAnswers] = useState([])
    const [answered, setAnswered] = useState(false)
    const [testResult, setTestResult] = useState(null)
    const [timeRemaining, setTimeRemaining] = useState(null)

    const answerForm = useForm({
        resolver: zodResolver(studentTestAnswerSchema),
        defaultValues: {
            selectedAnswerIds: [],
        },
    })

    useEffect(() => {
        const loadData = async () => {
            const testData = await fetchTest(params.id)
            setTest(testData)

            const questionIdsData = await fetchTestQuestionIdsByTestId(params.id)
            setQuestionIds(questionIdsData)

            const testResultData = await fetchTestResultByStudentIdTestId(userStore.user.id, params.id)
            setTestResult(testResultData)
            setLoading(false)
        }

        loadData()
    }, [params.id])

    useEffect(() => {
        if (testResult && testResult.createdAt && !testResult.completedAt) {
            const createdAt = new Date(testResult.createdAt)
            const timeLimit = test.timeLimit * 60 * 1000
            const now = new Date()
            const endTime = addMilliseconds(createdAt, timeLimit)
            const initialTimeRemaining = differenceInMilliseconds(endTime, now)

            if (initialTimeRemaining > 0) {
                setTimeRemaining(initialTimeRemaining)

                const intervalId = setInterval(() => {
                    setTimeRemaining((prevTime) => {
                        const newTime = prevTime - 1000
                        if (newTime <= 0) {
                            clearInterval(intervalId)
                            completeTestResult(testResult.id).then((data) => {
                                setTestResult(data)
                                toast.success('Час тестування завершено, результат збережено.')
                            })
                        }
                        return newTime
                    })
                }, 1000)

                return () => clearInterval(intervalId)
            } else {
                completeTestResult(testResult.id).then((data) => {
                    setTestResult(data)
                    toast.success('Час тестування завершено, результат збережено.')
                })
            }
        }
    }, [testResult])

    const formatTimeRemaining = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    const handleQuestionClick = async (questionId) => {
        const questionData = await fetchTestQuestion(questionId)
        setSelectedQuestion(questionData)
        setAnswered(false)

        let currentTestResult = testResult

        if (!currentTestResult) {
            currentTestResult = await createTestResult(userStore.user.id, test.id)
            setTestResult(currentTestResult)
        }

        const answersData = await fetchStudentTestAnswersByResultIdQuestionId(currentTestResult.id, questionId)
        setStudentAnswers(answersData)
        if (answersData.length > 0) {
            setAnswered(true)
            answerForm.setValue('selectedAnswerIds', [])
        } else {
            const testAnswersData = await fetchTestAnswersByTestQuestionId(questionId)
            setAnswers(testAnswersData)
            answerForm.setValue('selectedAnswerIds', [])
        }
    }

    const handleCheckBoxChange = (answerId) => {
        if (answerForm.getValues('selectedAnswerIds').includes(answerId)) {
            answerForm.setValue(
                'selectedAnswerIds',
                answerForm.getValues('selectedAnswerIds').filter((id) => id !== answerId)
            )
        } else {
            answerForm.setValue('selectedAnswerIds', [...answerForm.getValues('selectedAnswerIds'), answerId])
        }
    }

    const handleRadioChange = (answerId) => {
        answerForm.setValue('selectedAnswerIds', [answerId])
    }

    const onAnswerSubmit = async () => {
        if (selectedQuestion.isManual) {
            const manualAnswer = answerForm.getValues('selectedAnswerIds')[0]
            const data = await createStudentTestAnswer(testResult.id, selectedQuestion.id, null, manualAnswer)
            setStudentAnswers([...studentAnswers, data])
            setAnswered(true)
        } else {
            const answerIds = answerForm.getValues('selectedAnswerIds')
            const data = await createStudentTestAnswer(testResult.id, selectedQuestion.id, answerIds)
            setStudentAnswers([...studentAnswers, ...data])
            setAnswered(true)
        }
        toast.success('Відповідь успішно закріплена.')
    }

    const onError = (errors) => {
        console.log(errors)
    }

    const handleTestSubmit = async () => {
        const data = await completeTestResult(testResult.id)
        setTestResult(data)
        toast.success('Тест успішно завершено.')
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

                    {testResult && testResult.completedAt ? (
                        <Card className='mt-2'>
                            <CardHeader>
                                <CardTitle>
                                    Ваш результат: {(testResult.mark * 100).toFixed(2)}% ({(testResult.mark * 12).toFixed(0)})
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ) : (
                        <div className='flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4'>
                            <div className='flex-1 space-y-2'>
                                <Card>
                                    <CardHeader>
                                        <div className='flex justify-between items-center align-middle'>
                                            <CardTitle>Питання</CardTitle>
                                            {timeRemaining !== null && (
                                                <div className='text-lg font-bold'>Час до завершення: {formatTimeRemaining(timeRemaining)}</div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedQuestion ? (
                                            <>
                                                <div className='text-lg' dangerouslySetInnerHTML={createMarkup(selectedQuestion.text)} />
                                                <Separator className='mt-3' />
                                                <h5 className='mt-4 mb-2 text-lg font-medium'>Відповідь:</h5>
                                                {answered ? (
                                                    <p className='text-muted-foreground'>Ви вже відповіли на це питання.</p>
                                                ) : (
                                                    <Form {...answerForm}>
                                                        <form onSubmit={answerForm.handleSubmit(onAnswerSubmit, onError)}>
                                                            <FormField
                                                                control={answerForm.control}
                                                                name='selectedAnswerIds'
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormControl>
                                                                            {answers.length > 0 ? (
                                                                                selectedQuestion.isManual ? (
                                                                                    <Input
                                                                                        className='w-full'
                                                                                        value={answerForm.getValues('selectedAnswerIds')[0] || ''}
                                                                                        onChange={(e) =>
                                                                                            answerForm.setValue('selectedAnswerIds', [e.target.value])
                                                                                        }
                                                                                    />
                                                                                ) : answers.filter((answer) => answer.isCorrect).length > 1 ? (
                                                                                    <>
                                                                                        {answers.map((answer) => (
                                                                                            <div className='flex items-center space-x-2'>
                                                                                                <Checkbox
                                                                                                    id={answer.id}
                                                                                                    key={answer.id}
                                                                                                    checked={answerForm
                                                                                                        .getValues('selectedAnswerIds')
                                                                                                        .includes(answer.id)}
                                                                                                    onCheckedChange={() => handleCheckBoxChange(answer.id)}>
                                                                                                    {answer.text}
                                                                                                </Checkbox>
                                                                                                <Label htmlFor={answer.id}>{answer.text}</Label>
                                                                                            </div>
                                                                                        ))}
                                                                                    </>
                                                                                ) : (
                                                                                    <RadioGroup onValueChange={(value) => handleRadioChange(value)}>
                                                                                        {answers.map((answer) => (
                                                                                            <div className='flex items-center space-x-2'>
                                                                                                <RadioGroupItem
                                                                                                    id={answer.id}
                                                                                                    key={answer.id}
                                                                                                    value={answer.id}>
                                                                                                    {answer.text}
                                                                                                </RadioGroupItem>
                                                                                                <Label htmlFor={answer.id}>{answer.text}</Label>
                                                                                            </div>
                                                                                        ))}
                                                                                    </RadioGroup>
                                                                                )
                                                                            ) : (
                                                                                <p className='text-muted-foreground'>
                                                                                    Відповіді на це питання відсутні. Це питання не буде враховане при
                                                                                    розрахунку результату.
                                                                                </p>
                                                                            )}
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            {answers.length > 0 && (
                                                                <Button type='submit' className='mt-4'>
                                                                    Закріпити відповідь
                                                                </Button>
                                                            )}
                                                        </form>
                                                    </Form>
                                                )}
                                            </>
                                        ) : (
                                            <p className='text-muted-foreground'>
                                                Оберіть питання зі списку, щоб побачити його деталі та відповіді. Відлік почнеться коли ви оберете питання.
                                            </p>
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
                                <CardContent>
                                    <div className='grid grid-flow-row-dense auto-rows-max grid-cols-4 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2'>
                                        {questionIds.map((questionItem, index) => (
                                            <Button
                                                variant='ghost'
                                                className={cn({ 'bg-secondary': selectedQuestion?.id === questionItem.id })}
                                                key={questionItem.id}
                                                onClick={() => handleQuestionClick(questionItem.id)}>
                                                {index + 1}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button className='w-full mt-6' onClick={handleTestSubmit}>
                                        Завершити тест
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

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
