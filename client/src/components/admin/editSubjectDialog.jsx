'use client'

import { updateSubject } from '@/api/subjectAPI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PencilLineIcon } from 'lucide-react'
import { useState } from 'react'

export function EditSubjectDialog({ subject }) {
    const [subjectName, setSubjectName] = useState(subject.name)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUpdateSubject = async () => {
        setLoading(true)
        try {
            await updateSubject(subject.id, subjectName)
            setDialogOpen(false)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    return (
        <Dialog className='ml-auto' open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className='ml-auto h-6' variant='outline'>
                    <PencilLineIcon className='h-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Редагувати предмет</DialogTitle>
                    <DialogDescription>Введіть нову назву предмету та натисніть зберегти</DialogDescription>
                </DialogHeader>

                <div className='grid gap-4 py-4 grid-cols-4 items-center'>
                    <Label htmlFor='subject' className='text-right'>
                        Назва
                    </Label>
                    <Input id='subject' type='text' value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className='col-span-3' />
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button onClick={handleUpdateSubject} disabled={loading}>
                            Зберегти
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
