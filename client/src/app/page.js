'use client'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import Link from 'next/link'

export default function Home() {
    return (
        <main>
            <div className='flex min-h-screen flex-col items-center p-24'>
                <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                    Вітаємо!
                </h1>
                <p className='leading-7 [&:not(:first-child)]:mt-6'>
                    Щоб продовжити роботу, будь-ласка увійдіть.
                </p>
                <div className='flex space-x-4 mt-4'>
                    <Button className='p-0'>
                        <Link href='/login' className='p-3'>
                            Вхід
                        </Link>
                    </Button>
                </div>
            </div>
            <div className='fixed bottom-4 right-4'>
                <ModeToggle />
            </div>
        </main>
    )
}
