'use client'

import { useAppContext } from '@/components/context/appWrapper'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { GraduationCap, LibraryBig, LogOut, SquareUser, Triangle, Users } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const { userStore } = useAppContext()

    return (
        <div className='grid h-screen w-full pl-[56px]'>
            <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
                <div className='border-b p-2'>
                    <Button
                        onClick={() => {
                            router.push('/workspace')
                        }}
                        variant='outline'
                        size='icon'
                        aria-label='Home'>
                        <Triangle className='size-5 fill-foreground' />
                    </Button>
                </div>
                <nav className='grid gap-1 p-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        router.push('/workspace/admin/classes')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Класи'>
                                    <GraduationCap className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Класи
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        router.push('/workspace/admin/subjects')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Предмети'>
                                    <LibraryBig className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Предмети
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        router.push('/workspace/admin/users')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Користувачі'>
                                    <Users className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Користувачі
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
                <nav className='mt-auto grid gap-1 p-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        router.push('/profile')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='mt-auto rounded-lg'
                                    aria-label='Обліковий запис'>
                                    <SquareUser className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                {userStore.user.email}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        signOut({ redirect: false })
                                        userStore.setUser({})
                                        userStore.setIsAuth(false)
                                        router.push('/')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='mt-auto rounded-lg'
                                    aria-label='Вийти'>
                                    <LogOut className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Вийти з облікового запису
                            </TooltipContent>
                        </Tooltip>
                        <ModeToggle />
                    </TooltipProvider>
                </nav>
            </aside>
            {children}
        </div>
    )
}
