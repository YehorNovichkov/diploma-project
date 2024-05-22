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
import { useState } from 'react'
import { login, registration } from '@/api/userAPI'

export default function Register() {
    const { user } = useAppContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [patronymic, setPatronymic] = useState('')

    const handleRegister = async () => {
        try {
            let data = await registration(
                email,
                password,
                name,
                surname,
                patronymic
            )
            user.setUser(data)
            user.setIsAuth(true)
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Реєстрація</CardTitle>
                    <CardDescription>
                        Введіть ваш email нижче, для реєстрації.
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
                        <Label htmlFor='name'>Ім'я</Label>
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            id='name'
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='surname'>Прізвище</Label>
                        <Input
                            onChange={(e) => setSurname(e.target.value)}
                            id='surname'
                            required
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='patronymic'>По батькові</Label>
                        <Input
                            onChange={(e) => setPatronymic(e.target.value)}
                            id='patronymic'
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
                    <div className='grid gap-2'>
                        <Label htmlFor='passwordRepeat'>Повторіть пароль</Label>
                        <Input id='passwordRepeat' type='password' required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='w-full' onClick={handleRegister}>
                        Зареєструватись
                    </Button>
                </CardFooter>
            </Card>
            <div className='fixed bottom-4 right-4'>
                <ModeToggle />
            </div>
        </main>
    )
}
