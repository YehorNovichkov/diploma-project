'use client'

import { fetchClassesByName } from '@/api/classAPI'
import { fetchSubjectsByName } from '@/api/subjectAPI'
import { createTask } from '@/api/taskAPI'
import { ScrollArea } from '@/components//ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { TimePicker } from '@/components/ui/time-picker'
import Tiptap from '@/components/ui/tiptap'
import { cn } from '@/lib/utils'
import { taskSchema } from '@/schema/taskSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { debounce } from 'lodash'
import { CalendarIcon, GraduationCapIcon, LibraryBigIcon, Loader2Icon, PlusIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export function CreateTaskDialog() {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const form = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            name: '',
            description: '',
            deadline: new Date(tomorrow.setHours(24, 0, 0, 0)),
            subjectQuery: '',
            subjectId: '',
            classQuery: '',
            classId: '',
        },
    })

    const subjectQueryValue = form.watch('subjectQuery')
    const subjectIdValue = form.watch('subjectId')
    const [subjects, setSubjects] = useState([])
    const [subjectsLoading, setSubjectsLoading] = useState(false)
    const [subjectPopoverOpen, setSubjectPopoverOpen] = useState(false)

    const classQueryValue = form.watch('classQuery')
    const classIdValue = form.watch('classId')
    const [classes, setClasses] = useState([])
    const [classesLoading, setClassesLoading] = useState(false)
    const [classPopoverOpen, setClassPopoverOpen] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const debouncedFetchClasses = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                setClassesLoading(true)
                try {
                    const fetchedClasses = await fetchClassesByName(query)
                    setClasses(fetchedClasses)
                } finally {
                    setClassesLoading(false)
                }
            } else {
                setClasses([])
            }
        }, 500),
        []
    )

    useEffect(() => {
        debouncedFetchClasses(classQueryValue)
    }, [classQueryValue, debouncedFetchClasses])

    const debouncedFetchSubjects = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                setSubjectsLoading(true)
                try {
                    const fetchedSubjects = await fetchSubjectsByName(query)
                    setSubjects(fetchedSubjects)
                } finally {
                    setSubjectsLoading(false)
                }
            } else {
                setSubjects([])
            }
        }, 500),
        []
    )

    useEffect(() => {
        debouncedFetchSubjects(subjectQueryValue)
    }, [subjectQueryValue, debouncedFetchSubjects])

    const onSubmit = async (values) => {
        setUploading(true)
        await createTask(values.name, values.description, values.deadline, values.classId, values.subjectId)
            .then(() => {
                form.reset()
                setDialogOpen(false)
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
                <Button className='ml-auto'>
                    <PlusIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] overflow-y-scroll max-h-screen'>
                <DialogHeader>
                    <DialogTitle>Додати завдання</DialogTitle>
                    <DialogDescription>Введіть дані завдання та натисніть зберегти</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className='grid gap-4 py-4 items-center' onSubmit={form.handleSubmit(onSubmit, onError)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Назва</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Назва завдання' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Опис</FormLabel>
                                    <FormControl>
                                        <Tiptap value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='deadline'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Дедлайн</FormLabel>
                                    <br />
                                    <Popover>
                                        <FormControl>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant='outline'
                                                    className={cn('w-[280px] justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                                    {field.value ? format(field.value, 'PPP HH:mm:ss', { locale: uk }) : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                        </FormControl>

                                        <PopoverContent className='w-auto p-0'>
                                            <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                                            <div className='p-3 border-t border-border'>
                                                <TimePicker setDate={field.onChange} date={field.value} />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='classQuery'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <div>
                                        <FormLabel>Клас</FormLabel>
                                        <FormDescription>Оберіть клас до якого буде відноситись завдання</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Popover open={classPopoverOpen} onOpenChange={setClassPopoverOpen} modal>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline'>
                                                    {classIdValue === '' ? (
                                                        'Обрати клас'
                                                    ) : (
                                                        <>
                                                            <GraduationCapIcon className='mr-2 h-4 w-4' />
                                                            {'Обраний клас: '}
                                                            {classes.find((c) => c.id === parseInt(classIdValue))?.name}
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent>
                                                <Input {...field} placeholder='Пошук класу' />
                                                <ScrollArea className='h-[150px] mt-2'>
                                                    {classesLoading && <Skeleton className='h-8' />}
                                                    {classes.map((classItem) => (
                                                        <>
                                                            <Separator className='my-2' />
                                                            <div
                                                                className='text-sm cursor-pointer hover:text-muted-foreground p-1'
                                                                key={classItem.id}
                                                                onClick={() => {
                                                                    form.setValue('classId', classItem.id)
                                                                    setClassPopoverOpen(false)
                                                                }}>
                                                                {classItem.name}
                                                            </div>
                                                        </>
                                                    ))}
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='subjectQuery'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <div>
                                        <FormLabel>Предмет</FormLabel>
                                        <FormDescription>Оберіть предмет до якого буде відноситись завдання</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Popover open={subjectPopoverOpen} onOpenChange={setSubjectPopoverOpen} modal>
                                            <PopoverTrigger asChild>
                                                <Button variant='outline'>
                                                    {subjectIdValue === '' ? (
                                                        'Обрати предмет'
                                                    ) : (
                                                        <>
                                                            <LibraryBigIcon className='mr-2 h-4 w-4' />
                                                            {'Обраний предмет: '}
                                                            {subjects.find((c) => c.id === parseInt(subjectIdValue))?.name}
                                                        </>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent>
                                                <Input {...field} placeholder='Пошук предмету' />
                                                <ScrollArea className='h-[150px] mt-2'>
                                                    {subjectsLoading && <Skeleton className='h-8' />}
                                                    {subjects.map((subjectItem) => (
                                                        <>
                                                            <Separator className='my-2' />
                                                            <div
                                                                className='text-sm cursor-pointer hover:text-muted-foreground p-1'
                                                                key={subjectItem.id}
                                                                onClick={() => {
                                                                    form.setValue('subjectId', subjectItem.id)
                                                                    setSubjectPopoverOpen(false)
                                                                }}>
                                                                {subjectItem.name}
                                                            </div>
                                                        </>
                                                    ))}
                                                </ScrollArea>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
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
