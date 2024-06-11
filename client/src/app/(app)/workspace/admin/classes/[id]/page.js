'use client'

import { fetchClass } from '@/api/classAPI'
import { fetchUsersByClass } from '@/api/userAPI'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2Icon, PencilLineIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Class({ params }) {
    const router = useRouter()
    const [classItem, setClassItem] = useState()
    const [classInputName, setClassInputName] = useState('')
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClass(params.id).then((data) => {
            setClassItem(data)
        })
        fetchUsersByClass(params.id).then((data) => {
            setStudents(data)
            setLoading(false)
        })
    }, [])

    const handleEditClass = async () => {
        try {
            const data = await updateClass(classInputName)
            setClassItem(data)
            toast.success('Клас успішно відредаговано')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader2Icon className='w-10 h-10 animate-spin' />
                </div>
            ) : (
                <div className='flex min-h-screen flex-col p-6 lg:p-12'>
                    <div className='flex items-center justify-between mb-12'>
                        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>{classItem.name}</h1>
                        <Dialog className='ml-auto'>
                            <DialogTrigger asChild>
                                <Button className='ml-auto'>
                                    <PencilLineIcon />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle>Редагувати клас</DialogTitle>
                                    <DialogDescription>Введіть нову назву класу та натисніть зберегти</DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4 grid-cols-4 items-center'>
                                    <Label htmlFor='class' className='text-right'>
                                        Назва
                                    </Label>
                                    <Input
                                        onChange={(e) => setClassInputName(e.target.value)}
                                        id='class'
                                        placeholder='Введіть назву класу'
                                        className='col-span-3'
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={handleEditClass}>Зберегти</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='grid grid-cols-1 gap-4'>
                        {students.map((studentItem) => (
                            <Card
                                key={studentItem.id}
                                className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                onClick={() => {
                                    router.push(`/workspace/admin/users/${studentItem.id}`)
                                }}>
                                <CardHeader>
                                    {studentItem.name} {studentItem.surname} {studentItem.patronymic}
                                </CardHeader>
                            </Card>
                        ))}
                        {students.length === 0 && <div className='text-muted-foreground'>У цьому класі немає учнів</div>}
                    </div>
                </div>
            )}
        </main>
    )
}
