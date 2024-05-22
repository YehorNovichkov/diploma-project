'use client'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from '@/components/ui/tooltip'
import {
    SquareUser,
    Triangle,
    School,
    BookText,
    BookCheck,
    LogIn,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/components/context/appWrapper'
import { useEffect, useState } from 'react'

export default function TeacherLayout({ children }) {
    const router = useRouter()
    const { userStore } = useAppContext()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userStore.isAuth === true) {
            setLoading(false)
        }
    }, [userStore.isAuth])
    return (
        <div className='grid h-screen w-full pl-[56px]'>
            <aside className='inset-y fixed  left-0 z-20 flex h-full flex-col border-r'>
                <div className='border-b p-2'>
                    <Button
                        onClick={() => {
                            router.push('/teacher')
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
                                        router.push('/teacher/classes')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Класи'>
                                    <School className='size-5' />
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
                                        router.push('/teacher/tasks')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Завдання'>
                                    <BookText className='size-5' />
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
                                        router.push('/teacher/tests')
                                    }}
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-lg'
                                    aria-label='Тести'>
                                    <BookCheck className='size-5' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side='right' sideOffset={5}>
                                Тести
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
                                        router.push('/teacher/profile')
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
                        <ModeToggle />
                    </TooltipProvider>
                </nav>
            </aside>
            {children}
        </div>
    )
}
