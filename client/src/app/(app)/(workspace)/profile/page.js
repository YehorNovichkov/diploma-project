'use client'

import { useAppContext } from '@/components/context/appWrapper'

export default function Profile() {
    const { userStore } = useAppContext()

    return (
        <main>
            <div className='flex min-h-screen flex-col items-center p-24'>
                <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                    {userStore.user.name} {userStore.user.surname}{' '}
                    {userStore.user.patronymic}
                </h1>
                <p className='leading-7 [&:not(:first-child)]:mt-6'>
                    {userStore.user.email}
                </p>
            </div>
        </main>
    )
}
