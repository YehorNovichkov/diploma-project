'use client'

import { fetchClassesByName } from '@/api/classAPI'
import { addUser, fetchUsersByFullNameAndRole } from '@/api/userAPI'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { userSchema } from '@/schema/userSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { debounce } from 'lodash'
import { GraduationCapIcon, Loader2Icon, PlusIcon, UserIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const roles = [
    {
        displayName: 'Учень',
        internalName: 'student',
    },
    {
        displayName: 'Вчитель',
        internalName: 'teacher',
    },
    {
        displayName: 'Батьки',
        internalName: 'parent',
    },
    {
        displayName: 'Адміністратор',
        internalName: 'admin',
    },
]

export function AddUserDialog() {
    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            surname: '',
            patronymic: '',
            roles: [],
            // student fields
            classQuery: '',
            classId: '',
            parentQuery: '',
            parentId: '',
        },
    })

    const rolesValues = form.watch('roles')

    const classQueryValue = form.watch('classQuery')
    const classIdValue = form.watch('classId')
    const [classes, setClasses] = useState([])
    const [classesLoading, setClassesLoading] = useState(false)
    const [classPopoverOpen, setClassPopoverOpen] = useState(false)

    const parentQueryValue = form.watch('parentQuery')
    const parentIdValue = form.watch('parentId')
    const [parents, setParents] = useState([])
    const [parentsLoading, setParentsLoading] = useState(false)
    const [parentPopoverOpen, setParentPopoverOpen] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!rolesValues.includes('student')) {
            form.setValue('classId', '')
            form.setValue('classQuery', '')
            form.setValue('parentId', '')
            form.setValue('parentQuery', '')
        }
    }, [rolesValues])

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

    const debouncedFetchParents = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                setParentsLoading(true)
                try {
                    const fetchedParents = await fetchUsersByFullNameAndRole(query, 'parent')
                    console.log(fetchedParents)
                    setParents(fetchedParents)
                } finally {
                    setParentsLoading(false)
                }
            } else {
                setParents([])
            }
        }, 500),
        []
    )

    useEffect(() => {
        debouncedFetchParents(parentQueryValue)
    }, [parentQueryValue, debouncedFetchParents])

    const onSubmit = async (values) => {
        setUploading(true)
        await addUser(values.name, values.surname, values.patronymic, values.roles, values.classId, values.parentId)
            .then(() => {
                form.reset()
                setDialogOpen(false)
                toast.success('Користувача успішно додано')
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
            <DialogContent className='sm:max-w-[600px] overflow-y-scroll max-h-screen'>
                <DialogHeader>
                    <DialogTitle>Додати користувача</DialogTitle>
                    <DialogDescription>Введіть дані користувача та натисніть зберегти</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className='grid gap-4 py-4 items-center' onSubmit={form.handleSubmit(onSubmit, onError)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ім'я</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Іван' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='surname'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Прізвище</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Іванов' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='patronymic'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>По-батькові</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Іванович' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='roles'
                            render={() => (
                                <FormItem>
                                    <div className='mb-4'>
                                        <FormLabel>Ролі</FormLabel>
                                        <FormDescription>Оберіть які ролі матиме користувач</FormDescription>
                                    </div>
                                    {roles.map((role) => (
                                        <FormField
                                            key={role.internalName}
                                            control={form.control}
                                            name='roles'
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={role.internalName} className='flex flex-row items-start space-x-3 space-y-0'>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(role.internalName)}
                                                                onCheckedChange={(checked) =>
                                                                    checked
                                                                        ? field.onChange([...field.value, role.internalName])
                                                                        : field.onChange(field.value.filter((r) => r !== role.internalName))
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormLabel>{role.displayName}</FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {rolesValues.includes('student') && (
                            <>
                                <Separator />
                                <FormField
                                    name='classQuery'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div>
                                                <FormLabel>Клас</FormLabel>
                                                <FormDescription>Оберіть до якого класу буде відноситись учень</FormDescription>
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
                                                                            form.setValue('classId', classItem.id.toString())
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
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name='parentQuery'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <div>
                                                <FormLabel>Батько/Мати</FormLabel>
                                                <FormDescription>
                                                    Оберіть користувача, що буде вважатись батьком/мати учня та зможе переглядати його успішність
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Popover open={parentPopoverOpen} onOpenChange={setParentPopoverOpen} modal>
                                                    <PopoverTrigger asChild>
                                                        <Button variant='outline' className='max-w-[550px] flex items-center'>
                                                            {parentIdValue === '' ? (
                                                                'Обрати користувача'
                                                            ) : (
                                                                <>
                                                                    <UserIcon className='mr-2 h-4 w-4' />
                                                                    {'Обраний користувач: '}
                                                                    <span className='overflow-hidden overflow-ellipsis whitespace-nowrap ml-1'>
                                                                        {parents.find((c) => c.id === parentIdValue)?.name}{' '}
                                                                        {parents.find((c) => c.id === parentIdValue)?.surname}{' '}
                                                                        {parents.find((c) => c.id === parentIdValue)?.patronymic}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <Input {...field} placeholder='Пошук облікового запису' />
                                                        <ScrollArea className='h-[150px] mt-2'>
                                                            {parentsLoading && <Skeleton className='h-8' />}
                                                            {parents.map((parentItem) => (
                                                                <>
                                                                    <Separator className='my-2' />
                                                                    <div
                                                                        className='text-sm cursor-pointer hover:text-muted-foreground p-1'
                                                                        key={parentItem.id}
                                                                        onClick={() => {
                                                                            form.setValue('parentId', parentItem.id)
                                                                            setParentPopoverOpen(false)
                                                                            console.log(
                                                                                parents.find((c) => c.id === parseInt(parentIdValue))?.name,
                                                                                parentIdValue
                                                                            )
                                                                        }}>
                                                                        {parentItem.name + ' ' + parentItem.surname + ' ' + parentItem.patronymic}
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
                            </>
                        )}
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
