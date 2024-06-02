'use client'

import { fetchClass } from '@/api/classAPI'
import { fetchUser } from '@/api/userAPI'
import { EditUserDialog } from '@/components/admin/editUserDialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
                                    <div className='flex-initial'>
                                        <EditUserDialog user={userItem} />
                                    </div>
                                </div>
                            </CardTitle>
                            <CardDescription>{userItem.email}</CardDescription>
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
                                                    <Link href={`/admin/classes/${classItem.id}`} className='flex-initial hover:text-muted-foreground'>
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
                                                    <Link href={`/admin/users/${parentItem.id}`} className='flex-initial hover:text-muted-foreground'>
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
