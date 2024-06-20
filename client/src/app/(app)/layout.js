'use client'

import { fetchUser } from '@/api/userAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { authenticator } from '@/lib/imagekit'
import { getCurrentUserAccessToken } from '@/lib/session'
import { IKContext } from 'imagekitio-react'
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
        const handleRedirection = () => {
            if (!checkAccess(userStore.user.roles, pathname) && pathname.includes('/workspace/')) {
                router.push('/not-authorized')
                return
            } else if (pathname === '/workspace') {
                if (userStore.user.roles.length === 1) {
                    router.push(accessRules[userStore.user.roles[0]])
                } else {
                    setDataLoaded(true)
                    return
                }
            } else if (pathname.includes('/login') || pathname.includes('/register')) {
                if (userStore.user.roles.length === 1) {
                    router.push(accessRules[userStore.user.roles[0]])
                } else {
                    router.push('/workspace')
                }
                setDataLoaded(true)
                return
            }
            setDataLoaded(true)
        }

        if (userStore.isAuth === true) {
            handleRedirection()
        } else {
            const setUser = async (data) => {
                userStore.setUserId(data.id)
                await fetchUser(data.id).then((res) => {
                    userStore.setUser(res)
                    userStore.setIsAuth(true)
                })
            }

            getCurrentUserAccessToken().then((token) => {
                if (token) {
                    const decodedToken = jwtDecode(token)
                    const currentTime = Date.now().valueOf() / 1000

                    if (decodedToken.exp > currentTime) {
                        setUser(decodedToken).then(() => {
                            handleRedirection()
                        })
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
        }
    }, [router, pathname, userStore])

    return (
        <>
            {dataLoaded ? (
                <IKContext
                    publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
                    urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                    authenticator={authenticator}>
                    {children}
                </IKContext>
            ) : (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader2Icon className='w-10 h-10 animate-spin' />
                </div>
            )}
        </>
    )
}
