'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAppContext } from '@/components/context/appWrapper'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { login } from '@/api/userAPI'

export default function Login() {
    const router = useRouter()
    const { user } = useAppContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            let data = await login(email, password)
            user.setUser(data)
            user.setIsAuth(true)
            router.push('/teacher')
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Вхід</CardTitle>
                    <CardDescription>
                        Введіть ваш email нижче, для входу.
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            id='email'
                            type='email'
                            placeholder='m@example.com'
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='password'>Пароль</Label>
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            id='password'
                            type='password'
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full' onClick={handleLogin}>
                        Вхід
                    </Button>
                </CardFooter>
            </Card>
            <div className='fixed bottom-4 right-4'>
                <ModeToggle />
            </div>
        </main>
    )
}
