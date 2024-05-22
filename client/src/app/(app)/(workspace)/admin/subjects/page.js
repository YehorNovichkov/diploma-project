'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { fetchSubjects, createSubject } from '@/api/subjectAPI'
import { useAppContext } from '@/components/context/appWrapper'

export default function Subjects() {
    const { user } = useAppContext()
    const [subjects, setSubjects] = useState([])
    const [subjectInputName, setSubjectInputName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSubjects().then((data) => {
            setSubjects(data)
            setLoading(false)
        })
    }, [])

    const handleAddSubject = async () => {
        try {
            const data = await createSubject(
                subjectInputName,
                '69e70343-ccec-4a86-8e91-653766e31aa1'
            )
            console.log(subjectInputName, user.user.id, data)
            setSubjects([...subjects, data])
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader className='w-10 h-10' />
                </div>
            ) : (
                <div className='flex min-h-screen flex-col items-center p-24'>
                    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                        Класи
                    </h1>
                    <div className='mb-4'>
                        <Label htmlFor='subject'>Назва предмету</Label>
                        <Input
                            onChange={(e) =>
                                setSubjectInputName(e.target.value)
                            }
                            id='subject'
                            type='text'
                            placeholder='Введіть назву предмету'
                        />
                        <Button onClick={handleAddSubject} className='mt-2'>
                            Додати предмет
                        </Button>
                    </div>
                    {subjects.map((subjectItem) => (
                        <Card key={subjectItem.id} className='mt-2'>
                            <CardHeader>{subjectItem.name}</CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}
