'use client'

import { fetchAvarageTaskMarkByStudentId } from '@/api/taskAnswerAPI'
import { fetchAvarageTestMarkByStudentId } from '@/api/testResultAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TaskAnswer() {
    const { parentStore } = useAppContext()
    const [loading, setLoading] = useState(true)
    const [avgTaskMark, setAvgTaskMark] = useState(null)
    const [avgTestMark, setAvgTestMark] = useState(null)

    useEffect(() => {
        fetchAvarageTaskMarkByStudentId(parentStore.selectedStudentId).then((data) => {
            setAvgTaskMark(data.avgMark)
        })
        fetchAvarageTestMarkByStudentId(parentStore.selectedStudentId).then((data) => {
            setAvgTestMark(data.avgMark)
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
                <div className='p-6 lg:p-12 space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>{avgTaskMark}</CardTitle>
                            <CardDescription>Середня оцінка за завдання</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {avgTestMark * 100}% ({avgTestMark * 12})
                            </CardTitle>
                            <CardDescription>Середня оцінка за тести</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            )}
        </main>
    )
}
