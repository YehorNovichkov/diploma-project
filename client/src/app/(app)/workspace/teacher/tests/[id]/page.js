'use client'

import { createTestAnswer, deleteTestAnswer, fetchTestAnswersByTestQuestionId } from '@/api/testAnswerAPI'
import { fetchTest, updateHiddenTest } from '@/api/testAPI'
import { deleteTestQuestion, fetchTestQuestion, fetchTestQuestionIdsByTestId, updateTestQuestionFilesCount } from '@/api/testQuestionAPI'
import { fetchTestResultsByTestId } from '@/api/testResultAPI'
import { CreateTestQuestionDialog } from '@/components/teacher/createTestQuestionDialog'
import { EditTestDialog } from '@/components/teacher/editTestDialog'
import { EditTestQuestionDialog } from '@/components/teacher/editTestQuestionDialog'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { createMarkup } from '@/lib/createMarkup'
import { imageKitLoader } from '@/lib/imagekit'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { cn } from '@/lib/utils'
import { testAnswerSchema } from '@/schema/testAnswerSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { IKUpload } from 'imagekitio-react'
import { debounce } from 'lodash'
import { CircleCheckBigIcon, Loader2Icon, PlusCircle, PlusIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function TestDetails({ params }) {
    const router = useRouter()
    const ikUploadRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [test, setTest] = useState(null)
    const [questionIds, setQuestionIds] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [answers, setAnswers] = useState([])
    const [results, setResults] = useState([])
    const [hidden, setHidden] = useState(null)

    const answerForm = useForm({
        resolver: zodResolver(testAnswerSchema),
        defaultValues: {
            text: '',
            isCorrect: false,
            testQuestionId: selectedQuestion?.id,
        },
    })

    useEffect(() => {
        fetchTest(params.id).then((data) => {
            setTest(data)
            setHidden(data.hidden)
        })

        fetchTestQuestionIdsByTestId(params.id).then((data) => {
            setQuestionIds(data)
            setLoading(false)
        })

        fetchTestResultsByTestId(params.id).then((data) => {
            setResults(data)
        })
    }, [params.id])

    const handleQuestionClick = (questionId) => {
        fetchTestQuestion(questionId).then((data) => {
            setSelectedQuestion(data)
            answerForm.setValue('testQuestionId', data.id)

            fetchTestAnswersByTestQuestionId(questionId).then((answersData) => {
                setAnswers(answersData)
            })
        })
    }

    const onAnswerSubmit = async (data) => {
        createTestAnswer(data.text, data.isCorrect, selectedQuestion.id).then((data) => {
            setAnswers((prev) => [...prev, data])
            answerForm.setValue('text', '')
            answerForm.setValue('isCorrect', false)
        })
    }

    const onAnswerError = (errors) => {
        console.log(errors)
    }

    const handleAnswerDelete = (answerId) => {
        deleteTestAnswer(answerId).then(() => {
            setAnswers((prev) => prev.filter((answer) => answer.id !== answerId))
        })
    }

    const handleQuestionDelete = (questionId) => {
        deleteTestQuestion(questionId).then(() => {
            setQuestionIds((prev) => prev.filter((question) => question.id !== questionId))
        })
    }

    const handleUploadError = (error) => {
        toast.error('Помилка завантаження зображення')
        console.log(error)
    }

    const handleUploadSuccess = (response) => {
        toast.success('Зображення успішно завантажено')
        setLoading(true)
        updateTestQuestionFilesCount(params.id, parseInt(selectedQuestion.filesCount) + 1).then((data) => {
            setSelectedQuestion(data)
            setLoading(false)
        })
    }

    const handleHiddenChange = debounce(() => {
        updateHiddenTest(test.id, !hidden).then(() => {
            const prevHidden = hidden
            setHidden(!prevHidden)
            toast.success(`Тест ${!prevHidden ? 'приховано' : 'відкрито'}`)
        })
    })

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
                                    <div className='flex'>
                                        <EditTestDialog test={test} setTest={setTest} classItem={test.class} subjectItem={test.subject} />
                                        <span className='text-sm text-muted-foreground ml-2'>
                                            {format(toZonedTime(new Date(test.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                        </span>
                                    </div>
                                </div>

                                <CardDescription>
                                    {test.class.name} • {test.subject.name} • Ліміт часу: {test.timeLimit} хв • Дедлайн:{' '}
                                    {format(toZonedTime(new Date(test.deadline), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')} ({getTimeUntilDeadline(test.deadline)})
                                    <div className='flex items-center space-x-2 mt-2'>
                                        <Label htmlFor='hidden'>Приховане: </Label>
                                        <Switch id='hidden' checked={hidden} onCheckedChange={handleHiddenChange} />
                                    </div>
                                </CardDescription>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <div className='flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4'>
                        <div className='flex-1 space-y-2'>
                            <Card>
                                <CardHeader>
                                    <div className='flex justify-between items-center align-middle'>
                                        <CardTitle>Питання</CardTitle>
                                        <div className='flex'>
                                            {selectedQuestion && (
                                                <>
                                                    <EditTestQuestionDialog question={selectedQuestion} setQuestion={setSelectedQuestion} />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button className='ml-1 h-6'>
                                                                <TrashIcon className='h-4' />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Ви впевнені що хочете видалити це запитання?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Ця дія незворотня! Видалення запитання призведе до видалення всіх даних, пов'язаних з ним.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleQuestionDelete(selectedQuestion.id)}>
                                                                    Видалити
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {selectedQuestion && selectedQuestion.isManual && <CardDescription>Питання передбачає ручну відповідь</CardDescription>}
                                </CardHeader>
                                <CardContent>
                                    {selectedQuestion ? (
                                        <>
                                            <div className='text-lg' dangerouslySetInnerHTML={createMarkup(selectedQuestion.text)} />
                                            <Separator className='mt-3' />
                                            <h5 className='mt-4 mb-2 text-lg font-medium'>Варіанти відповідей:</h5>
                                            {answers.map((answer) => (
                                                <div className='flex space-x-2 mt-2 align-middle items-center'>
                                                    <div
                                                        key={answer.id}
                                                        className={cn('border rounded-md p-2 pl-4 w-full', {
                                                            'border-green-700': answer.isCorrect,
                                                            'border-red-700': !answer.isCorrect,
                                                        })}>
                                                        {answer.text}
                                                    </div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button className='px-2 m-0'>
                                                                <TrashIcon />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Ви впевнені що хочете видалити цей варіант відповіді?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Ця дія незворотня! Видалення варіанту відповіді призведе до видалення всіх даних, пов'язаних
                                                                    з ним.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleAnswerDelete(answer.id)}>Видалити</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            ))}
                                            <Form {...answerForm}>
                                                <form
                                                    className='flex space-x-2 mt-2 align-middle items-center'
                                                    onSubmit={answerForm.handleSubmit(onAnswerSubmit, onAnswerError)}>
                                                    <FormField
                                                        control={answerForm.control}
                                                        name='text'
                                                        render={({ field }) => (
                                                            <FormItem className='flex-1'>
                                                                <FormControl>
                                                                    <Input {...field} className='pl-4' placeholder='Новий варіант відповіді...' />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={answerForm.control}
                                                        name='isCorrect'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className='flex items-center mr-2'>
                                                                    <FormLabel className='mr-1 ml-2'>
                                                                        <CircleCheckBigIcon />
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Switch
                                                                            checked={answerForm.watch('isCorrect')}
                                                                            onCheckedChange={() =>
                                                                                answerForm.setValue('isCorrect', !answerForm.watch('isCorrect'))
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                </div>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type='submit' className='px-2'>
                                                        <PlusIcon />
                                                    </Button>
                                                </form>
                                            </Form>
                                        </>
                                    ) : (
                                        <p className='text-muted-foreground'>Оберіть питання зі списку, щоб побачити його деталі та відповіді.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {selectedQuestion && (
                                <Card className='w-full'>
                                    <CardHeader>
                                        <CardTitle>Зображення</CardTitle>
                                    </CardHeader>
                                    <CardContent className='grid grid-cols-1 items-center align-middle gap-4'>
                                        {selectedQuestion.filesCount > 0 && (
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
                                        )}

                                        <IKUpload
                                            fileName={selectedQuestion.id + '_' + (parseInt(selectedQuestion.filesCount) + 1)}
                                            folder={'/test-question'}
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
                                <CreateTestQuestionDialog testId={parseInt(params.id)} setQuestionIds={setQuestionIds} />
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className='my-4' />

                    <h1 className='text-2xl font-semibold my-4'>Результати учнів:</h1>
                    {results.length > 0 ? (
                        results.map((result) => (
                            <Card
                                key={result.id}
                                className='w-full mb-2 cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                onClick={() => {
                                    router.push(`/workspace/teacher/test-result/${result.id}`)
                                }}>
                                <CardHeader className='pb-2'>
                                    <CardTitle>
                                        <div className='flex justify-between items-center align-middle'>
                                            <CardTitle>
                                                {result.student.name} {result.student.surname} {result.student.patronymic}
                                            </CardTitle>
                                            <div className='flex'>
                                                <span className='text-sm text-muted-foreground'>
                                                    {format(toZonedTime(new Date(result.completedAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                                </span>
                                            </div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        <span>Результат:</span> {(result.mark * 100).toFixed(2)}% ({(result.mark * 12).toFixed(0)})
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className='text-muted-foreground'>Поки що результатів немає.</p>
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
