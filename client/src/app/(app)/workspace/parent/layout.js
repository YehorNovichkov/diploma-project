'use client'

import { useAppContext } from '@/components/context/appWrapper'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BarChart2, BookCheck, ListTodo, Loader2Icon, LogOut, SquareUser, Triangle } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TeacherLayout({ children }) {
    const router = useRouter()
    const { userStore, parentStore } = useAppContext()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userStore.user.children.length > 0) {
            parentStore.setSelectedStudentId(userStore.user.children[0].id)
            setLoading(false)
        }
    }, [])

    if (userStore.user.children.length < 1) {
        return (
            <main>
                <div className='flex items-center justify-center text-3xl'>До вашого облікового запису не прив'язано жодного учня</div>
            </main>
        )
    }

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
                                        router.push('/workspace/parent/task-answers')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Завдання'>
                                    <BookCheck className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Завдання
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        router.push('/workspace/parent/test-results')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Тести'>
                                    <ListTodo className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Тести
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        router.push('/workspace/parent/stats')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Статистика'>
                                    <BarChart2 className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Статистика
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
            {loading ? <Loader2Icon className='w-10 h-10 animate-spin' /> : children}
        </div>
    )
}
