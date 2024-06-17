'use client'

import { fetchTaskAnswersByStudent } from '@/api/taskAnswerAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Loader2Icon, SquareXIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ParentTaskAnswers() {
    const { parentStore } = useAppContext()
    const router = useRouter()
    const [answers, setAnswers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTaskAnswersByStudent(parentStore.selectedStudentId).then((data) => {
            setAnswers(data)
            setLoading(false)
        })
    }, [])

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader2Icon className='w-10 h-10 animate-spin' />
                </div>
            ) : (
                <div className='p-6 lg:p-12'>
                    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xlm mb-12'>Відповіді дитини на завдання</h1>
                    {answers.length > 0 ? (
                        answers.map((answer) => (
                            <Card
                                key={answer.id}
                                className='w-full mb-2 cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                onClick={() => {
                                    router.push(`/workspace/parent/task-answers/${answer.id}`)
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
                                                    <SquareXIcon className='w-3 h-3' /> Не оцінено
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
                </div>
            )}
        </main>
    )
}
