'use client'

import { useAppContext } from '@/components/context/appWrapper'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
        displayName: 'Батько/мати',
        internalName: 'parent',
    },
    {
        displayName: 'Адмін',
        internalName: 'admin',
    },
]

export default function WorkspacePage() {
    const { userStore } = useAppContext()
    const router = useRouter()

    useEffect(() => {
        if (userStore.user.roles <= 1) {
            router.push(`/workspace/${userStore.user.roles[0]}`)
        }
    }, [])

    return (
        <main>
            <div className='flex justify-center p-6 lg:p-12'>
                <Card className='min-w-96'>
                    <CardHeader>
                        <CardTitle>Оберіть роль</CardTitle>
                        <CardDescription>Оберіть до робочої зони якої з ваших ролей ви перейдете</CardDescription>
                    </CardHeader>
                    <CardContent className='flex justify-between'>
                        {userStore.user.roles.map((role, index) => {
                            const matchedRole = roles.find((r) => r.internalName === role)
                            return (
                                <Link key={index} href={`/workspace/${role}`} className={buttonVariants({ variant: 'secondary' })}>
                                    {matchedRole ? matchedRole.displayName : role}
                                </Link>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
