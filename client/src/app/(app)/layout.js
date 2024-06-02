'use client'

import { useEffect, useState } from 'react'
import { getCurrentUserAccessToken } from '@/lib/session'
import { useAppContext } from '@/components/context/appWrapper'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { fetchUser } from '@/api/userAPI'
import { Loader2Icon } from 'lucide-react'

export default function AppLayout({ children }) {
    const { userStore } = useAppContext()
    const router = useRouter()
    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        if (userStore.isAuth === true) {
            setDataLoaded(true)
            return
        }

        const getSessionToken = async () => {
            return await getCurrentUserAccessToken()
        }

        const setUser = async (token) => {
            if (token) {
                const data = jwtDecode(token)
                userStore.setUserId(data.id)
                const userData = await fetchUser(userStore.userId)
                userStore.setUser(userData)
                userStore.setIsAuth(true)
            }
        }

        getSessionToken().then((token) => {
            if (token) {
                setUser(token).then(() => {
                    setDataLoaded(true)
                    return
                })
            } else {
                router.push('/login')
                setDataLoaded(true)
            }
        })
    }, [router])

    if (!dataLoaded) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <Loader2Icon className='w-10 h-10 animate-spin' />
            </div>
        )
    }
    return children
}
