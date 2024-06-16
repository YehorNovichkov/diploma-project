'use client'

import { fetchClassesByName } from '@/api/classAPI'
import { fetchSubjectsByName } from '@/api/subjectAPI'
import { updateTest } from '@/api/testAPI'
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
import { cn } from '@/lib/utils'
import { testSchema } from '@/schema/testSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { debounce } from 'lodash'
import { CalendarIcon, GraduationCapIcon, LibraryBigIcon, Loader2Icon, PencilLineIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function EditTestDialog({ test, setTest, classItem, subjectItem }) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const form = useForm({
        resolver: zodResolver(testSchema),
        defaultValues: {
            name: test.name || '',
            deadline: new Date(test.deadline) || new Date(tomorrow.setHours(24, 0, 0, 0)),
            timeLimit: test.timeLimit || 10, // in minutes
            subjectQuery: '',
            subjectId: test.subjectId || '',
            classQuery: '',
            classId: test.classId || '',
        },
    })

    const subjectQueryValue = form.watch('subjectQuery')
    const subjectIdValue = form.watch('subjectId')
    const [subjects, setSubjects] = useState([classItem])
    const [subjectsLoading, setSubjectsLoading] = useState(false)
    const [subjectPopoverOpen, setSubjectPopoverOpen] = useState(false)

    const classQueryValue = form.watch('classQuery')
    const classIdValue = form.watch('classId')
    const [classes, setClasses] = useState([subjectItem])
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
            } else if (classPopoverOpen) {
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
            } else if (subjectPopoverOpen) {
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
        await updateTest(test.id, values.name, values.deadline, values.timeLimit, values.classId, values.subjectId)
            .then((data) => {
                setTest(data)
                form.reset()
                setDialogOpen(false)
                toast.success('Тест успішно оновлено')
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
                <Button className='ml-auto h-6'>
                    <PencilLineIcon className='h-4' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[700px] overflow-y-scroll max-h-screen'>
                <DialogHeader>
                    <DialogTitle>Редагувати тест</DialogTitle>
                    <DialogDescription>Введіть дані тесту та натисніть зберегти</DialogDescription>
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
                                        <Input {...field} placeholder='Назва тесту' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='timeLimit'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Обмеження по часу (в хвилинах)</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='number'
                                            min='1'
                                            placeholder='Обмеження по часу'
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
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
                                                        <div key={classItem.id}>
                                                            <Separator className='my-2' />
                                                            <div
                                                                className='text-sm cursor-pointer hover:text-muted-foreground p-1'
                                                                onClick={() => {
                                                                    form.setValue('classId', classItem.id)
                                                                    setClassPopoverOpen(false)
                                                                }}>
                                                                {classItem.name}
                                                            </div>
                                                        </div>
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
