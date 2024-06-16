'use client'

import { createTestQuestion } from '@/api/testQuestionAPI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import Tiptap from '@/components/ui/tiptap'
import { testQuestionSchema } from '@/schema/testQuestionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function CreateTestQuestionDialog({ testId, setQuestionIds }) {
    const form = useForm({
        resolver: zodResolver(testQuestionSchema),
        defaultValues: {
            text: '',
            isManual: false,
        },
    })

    const [dialogOpen, setDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const onSubmit = async (values) => {
        setUploading(true)
        await createTestQuestion(values.text, values.isManual, testId)
            .then((data) => {
                form.reset()
                setDialogOpen(false)
                setQuestionIds((prev) => [...prev, { id: data.id }])
            })
            .catch((e) => {
                setError(e)
            })
            .finally(() => {
                setUploading(false)
            })
    }

    const onError = (error) => {
        console.log(error)
    }

    return (
        <Dialog className='ml-auto' open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className='ml-auto p-0 py-2 w-full h-full'>
                    <PlusIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] overflow-y-scroll max-h-screen'>
                <DialogHeader>
                    <DialogTitle>Додати запитання тесту</DialogTitle>
                    <DialogDescription>Введіть дані запитання тесту та натисніть зберегти</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className='grid gap-4 py-4 items-center' onSubmit={form.handleSubmit(onSubmit, onError)}>
                        <FormField
                            control={form.control}
                            name='text'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Текст запитання</FormLabel>
                                    <FormControl>
                                        <Tiptap value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='isManual'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex items-center mr-2'>
                                        <FormLabel className='mr-3'>Ручне введення відповіді:</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={form.watch('isManual')}
                                                onCheckedChange={() => form.setValue('isManual', !form.watch('isManual'))}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={uploading}>
                            {uploading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Зберегти'}
                        </Button>
                        {error && <FormMessage type='error'>Сталася помилка ({error.message})</FormMessage>}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
