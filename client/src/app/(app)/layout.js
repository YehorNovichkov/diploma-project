'use client'

import { fetchUser } from '@/api/userAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { getCurrentUserAccessToken } from '@/lib/session'
import { jwtDecode } from 'jwt-decode'
import { Loader2Icon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AppLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const { userStore } = useAppContext()
    const [dataLoaded, setDataLoaded] = useState(false)

    const accessRules = {
        admin: '/workspace/admin',
        teacher: '/workspace/teacher',
        student: '/workspace/student',
        parent: '/workspace/parent',
    }

    const checkAccess = (roles, pathname) => {
        for (const role of roles) {
            if (pathname.startsWith(accessRules[role])) {
                return true
            }
        }
        return false
    }

    useEffect(() => {
        if (userStore.isAuth === true) {
            setDataLoaded(true)
            if (!checkAccess(userStore.user.roles, pathname)) {
                router.push('/not-authorized')
            }
            return
        }

        const setUser = async (data) => {
            userStore.setUserId(data.id)
            await fetchUser(userStore.userId).then((res) => {
                userStore.setUser(res)
                userStore.setIsAuth(true)
                setDataLoaded(true)
                if (!checkAccess(res.roles, pathname)) {
                    router.push('/not-authorized')
                }
            })
        }

        getCurrentUserAccessToken().then((token) => {
            if (token) {
                const decodedToken = jwtDecode(token)
                const currentTime = Date.now().valueOf() / 1000

                if (decodedToken.exp > currentTime) {
                    setUser(decodedToken)
                } else {
                    signOut({ redirect: false })
                    if (!pathname.includes('/login') && !pathname.includes('/register')) {
                        router.push('/login')
                    }
                    setDataLoaded(true)
                }
            } else {
                if (!pathname.includes('/login') && !pathname.includes('/register')) {
                    router.push('/login')
                }
                setDataLoaded(true)
            }
        })
    }, [router, pathname, userStore])

    if (!dataLoaded) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <Loader2Icon className='w-10 h-10 animate-spin' />
            </div>
        )
    }
    return children
}
