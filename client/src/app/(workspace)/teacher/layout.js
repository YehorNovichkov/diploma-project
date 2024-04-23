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

export default function TeacherLayout({ children }) {
    const router = useRouter()
    const { user } = useAppContext()
    console.log(user)

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
                            {user.isAuth ? (
                                <>
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
                                        {user.user.email}
                                    </TooltipContent>
                                </>
                            ) : (
                                <>
                                    <TooltipTrigger>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => {
                                                    router.push('/login')
                                                }}
                                                variant='ghost'
                                                size='icon'
                                                className='mt-auto rounded-lg'
                                                aria-label='Вхід'>
                                                <LogIn className='size-5' />
                                            </Button>
                                        </TooltipTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side='right' sideOffset={5}>
                                        Вхід
                                    </TooltipContent>
                                </>
                            )}
                        </Tooltip>
                        <ModeToggle />
                    </TooltipProvider>
                </nav>
            </aside>
            {children}
        </div>
    )
}
