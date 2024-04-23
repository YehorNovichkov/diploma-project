'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { fetchClasses, createClass } from '@/api/classAPI'
import { useAppContext } from '@/components/context/appWrapper'

export default function Classes() {
    const { user } = useAppContext()
    const [classes, setClasses] = useState([])
    const [classInputName, setClassInputName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClasses().then((data) => {
            setClasses(data)
            setLoading(false)
        })
    }, [])

    const handleAddClass = async () => {
        try {
            const data = await createClass(
                classInputName,
                '69e70343-ccec-4a86-8e91-653766e31aa1'
            )
            console.log(classInputName, user.user.id, data)
            setClasses([...classes, data])
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
                    <div className='mb-4'>
                        <Label htmlFor='class'>Назва класу</Label>
                        <Input
                            onChange={(e) => setClassInputName(e.target.value)}
                            id='class'
                            type='text'
                            placeholder='Введіть назву класу'
                        />
                        <Button onClick={handleAddClass} className='mt-2'>
                            Додати клас
                        </Button>
                    </div>
                    {classes.map((classItem) => (
                        <Card key={classItem.id} className='mt-2'>
                            <CardHeader>{classItem.name}</CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}
