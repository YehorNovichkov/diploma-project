'use client'

import { fetchClass } from '@/api/classAPI'
import { fetchUser, resetUser } from '@/api/userAPI'
import { EditUserDialog } from '@/components/admin/editUserDialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ListRestartIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SimpleCrypto from 'simple-crypto-js'
import { toast } from 'sonner'

const roles = [
    {
        displayName: 'учень',
        internalName: 'student',
    },
    {
        displayName: 'вчитель',
        internalName: 'teacher',
    },
    {
        displayName: 'батько/мати',
        internalName: 'parent',
    },
    {
        displayName: 'адмін',
        internalName: 'admin',
    },
]

export default function User({ params }) {
    const [userItem, setUserItem] = useState()
    const [parentItem, setParentItem] = useState()
    const [classItem, setClassItem] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUser(params.id).then((data) => {
            setUserItem(data)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (userItem) {
            if (userItem.parentId) {
                fetchUser(userItem.parentId).then((data) => {
                    setParentItem(data)
                })
            }
            if (userItem.classId) {
                fetchClass(userItem.classId).then((data) => {
                    setClassItem(data)
                })
            }
        }
    }, [userItem])

    const handleUserReset = () => {
        resetUser(params.id).then((data) => {
            setUserItem(data)
            toast.success('Дані входу користувача скинуто')
        })
    }

    const sc = new SimpleCrypto(process.env.NEXT_PUBLIC_CRYPTO_KEY)
    const handleCopyLink = () => {
        const link = `${process.env.NEXT_PUBLIC_BASE_URL}/register/${encodeURIComponent(sc.encrypt(userItem.id))}`
        navigator.clipboard.writeText(link)
        toast('Посилання скопійовано')
    }

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader2Icon className='w-10 h-10 animate-spin' />
                </div>
            ) : (
                <div className='flex justify-center p-6 lg:p-12'>
                    <Card className='min-w-96'>
                        <CardHeader>
                            <CardTitle>
                                <div className='flex'>
                                    <div className='flex-1 mr-6'>
                                        {userItem.name} {userItem.surname} {userItem.patronymic}
                                    </div>
                                    <div className='flex'>
                                        <AlertDialog>
                                            <AlertDialogTrigger className='mr-2'>
                                                <Button className='ml-auto h-7' variant='outline'>
                                                    <ListRestartIcon className='h-4' />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Скинути дані входу користувача</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Ця дія скине дані входу користувача. Щоб увійти в систему, йому потрібно буде знову зареєструватися за
                                                        посиланням.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleUserReset}>Скинути</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <EditUserDialog user={userItem} setUser={setUserItem} />
                                    </div>
                                </div>
                            </CardTitle>
                            <CardDescription>
                                {userItem.email !== null ? (
                                    userItem.email
                                ) : (
                                    <Button variant='link' className='p-0' onClick={handleCopyLink}>
                                        Скопіювати посилання для реєстрації
                                    </Button>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            <div className='flex-auto mt-4'>
                                {userItem.roles.map((role, index) => {
                                    const matchedRole = roles.find((r) => r.internalName === role)
                                    return (
                                        <Badge key={index} className='mr-2 flex-initial'>
                                            {matchedRole ? matchedRole.displayName : role}
                                        </Badge>
                                    )
                                })}
                            </div>

                            <div className='flex-auto lg:flex mt-4 gap-2'>
                                {classItem && (
                                    <div className='flex-initial'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    <Link
                                                        href={`/workspace/admin/classes/${classItem.id}`}
                                                        className='flex-initial hover:text-muted-foreground'>
                                                        {classItem.name}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>Клас</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                )}
                                {parentItem && (
                                    <div className='flex-initial'>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>
                                                    <Link href={`/workspace/admin/users/${parentItem.id}`} className='flex-initial hover:text-muted-foreground'>
                                                        {parentItem.name} {parentItem.surname} {parentItem.patronymic}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>Батько/мати</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    )
}
