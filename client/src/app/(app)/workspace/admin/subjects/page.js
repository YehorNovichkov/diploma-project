'use client'

import { createSubject, fetchSubjects } from '@/api/subjectAPI'
import { EditSubjectDialog } from '@/components/admin/editSubjectDialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Subjects() {
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
            const data = await createSubject(subjectInputName)
            setSubjects([...subjects, data])
            toast.success('Предмет успішно додано')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen flex-col p-6 lg:p-12 mt-20'>
                    <div className='grid grid-cols-1 gap-4'>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-4 w-[250px]' />
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-4 w-[250px]' />
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-4 w-[250px]' />
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className='flex min-h-screen flex-col p-6 lg:p-12'>
                    <div className='flex items-center justify-between mb-12'>
                        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Предмети</h1>
                        <Dialog className='ml-auto'>
                            <DialogTrigger asChild>
                                <Button className='ml-auto'>
                                    <PlusIcon />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle>Додати премет</DialogTitle>
                                    <DialogDescription>Введіть назву предмету та натисніть зберегти</DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4 grid-cols-4 items-center'>
                                    <Label htmlFor='subject' className='text-right'>
                                        Назва
                                    </Label>
                                    <Input
                                        onChange={(e) => setSubjectInputName(e.target.value)}
                                        id='subject'
                                        placeholder='Введіть назву предмету'
                                        className='col-span-3'
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={handleAddSubject} disabled={loading}>
                                            Зберегти
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='grid grid-cols-1 gap-4'>
                        {subjects.map((subjectItem, index) => (
                            <Card key={subjectItem.id} className='mb-1 mt-1'>
                                <CardHeader>
                                    <div className='flex'>
                                        <CardTitle className='flex-1'>{subjectItem.name}</CardTitle>
                                        <EditSubjectDialog
                                            className='flex-initial'
                                            subject={subjectItem}
                                            setSubject={(updatedSubject) => {
                                                let newSubjects = [...subjects]
                                                newSubjects[index] = updatedSubject
                                                setSubjects(newSubjects)
                                            }}
                                        />
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </main>
    )
}
