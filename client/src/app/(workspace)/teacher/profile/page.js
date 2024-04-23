'use client'

import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { fetchUser } from '@/api/userAPI'
import { useAppContext } from '@/components/context/appWrapper'

export default function Profile() {
    const { user } = useAppContext()
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log(user)
        fetchUser(user.user.id).then((data) => {
            setData(data)
            setLoading(false)
        })
    }, [])

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen flex-col items-center p-24'>
                    <Loader className='size-12 animate-spin' />
                </div>
            ) : (
                <div className='flex min-h-screen flex-col items-center p-24'>
                    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                        {data.name} {data.surname} {data.patronymic}
                    </h1>
                    <p className='leading-7 [&:not(:first-child)]:mt-6'>
                        {data.email}
                    </p>
                </div>
            )}
        </main>
    )
}
