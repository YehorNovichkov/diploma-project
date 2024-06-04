'use client'

import { fetchUser, registration } from '@/api/userAPI'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { serverErrors } from '@/lib/serverErrors'
import { userRegisterSchema } from '@/schema/userRegisterSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import SimpleCrypto from 'simple-crypto-js'

export default function Register({ params }) {
    const form = useForm({
        resolver: zodResolver(userRegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            repeatPassword: '',
        },
    })

    const sc = new SimpleCrypto(process.env.NEXT_PUBLIC_CRYPTO_KEY)
    const userId = sc.decrypt(decodeURIComponent(params.encryptedId))

    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [user, setUser] = useState({})

    useEffect(() => {
        fetchUser(userId).then((data) => {
            setUser(data)
            setLoading(false)
        })
    }, [])

    const onSubmit = async (formData) => {
        setUploading(true)
        await registration(userId, formData.email, formData.password).then((data) => {
            if (data.message) {
                setError(data.message)
                return
            }
            router.push('/login')
        })
        setUploading(false)
    }

    const onError = (error) => {
        setError(error)
        console.log(error)
    }

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            {loading ? (
                <div className='flex min-h-screen items-center justify-center'>
                    <Loader2Icon className='w-10 h-10 animate-spin' />
                </div>
            ) : (
                <Card className='w-full max-w-sm'>
                    <CardHeader>
                        <CardTitle className='text-2xl'>Реєстрація</CardTitle>
                        <CardDescription>
                            Введіть ваш email та пароль нижче, для завершення реєстрації користувача {user.name} {user.surname} {user.patronymic}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className='grid gap-4 py-4 items-center' onSubmit={form.handleSubmit(onSubmit, onError)}>
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='example@email.com' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Пароль</FormLabel>
                                            <FormControl>
                                                <Input {...field} type='password' placeholder='********' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='repeatPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Повтор паролю</FormLabel>
                                            <FormControl>
                                                <Input {...field} type='password' placeholder='********' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit' disabled={uploading} className='mt-4'>
                                    {uploading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Зареєструватись'}
                                </Button>
                                {error && <FormMessage type='error'>{serverErrors[error]}</FormMessage>}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}

            <div className='fixed bottom-4 right-4'>
                <ModeToggle />
            </div>
        </main>
    )
}
