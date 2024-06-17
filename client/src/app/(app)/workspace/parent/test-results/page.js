'use client'

import { fetchTestResultsByStudentId } from '@/api/testResultAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ParentTestResults() {
    const { parentStore } = useAppContext()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [results, setResults] = useState([])

    useEffect(() => {
        fetchTestResultsByStudentId(parentStore.selectedStudentId).then((data) => {
            setResults(data)
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
                    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xlm mb-12'>Результати проходження тестів дитиною</h1>
                    {results.length > 0 ? (
                        results.map((result) => (
                            <Card
                                key={result.id}
                                className='w-full mb-2 cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                onClick={() => {
                                    router.push(`/workspace/parent/test-results/${result.id}`)
                                }}>
                                <CardHeader className='pb-2'>
                                    <CardTitle>
                                        <div className='flex justify-between items-center align-middle'>
                                            <CardTitle>{result.test.name}</CardTitle>
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
                                        {result.test.subject.name} • <span>Результат:</span> {(result.mark * 100).toFixed(2)}% ({(result.mark * 12).toFixed(0)})
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className='text-muted-foreground'>Поки що результатів немає.</p>
                    )}
                </div>
            )}
        </main>
    )
}
