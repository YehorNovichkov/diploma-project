'use client'

import { fetchUser } from '@/api/userAPI'
import { useAppContext } from '@/components/context/appWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { serverErrors } from '@/lib/serverErrors'
import { getCurrentUserAccessToken } from '@/lib/session'
import { userLoginSchema } from '@/schema/userLoginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { jwtDecode } from 'jwt-decode'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Login() {
    const form = useForm({
        resolver: zodResolver(userLoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const router = useRouter()
    const { userStore } = useAppContext()
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    const onSubmit = async (formData) => {
        setUploading(true)
        const res = await signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
        })

        const token = await getCurrentUserAccessToken()
        const data = jwtDecode(token)
        userStore.setUserId(data.id)
        userStore.setUserRoles(data.roles)
        const userData = await fetchUser(userStore.userId)
        userStore.setUser(userData)
        userStore.setIsAuth(true)
        setUploading(false)
        router.push('/workspace')
    }

    const onError = (error) => {
        setError(error)
        form.reset()
        console.log(error)
    }

    return (
        <main className='flex min-h-screen flex-col items-center p-24'>
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Вхід</CardTitle>
                    <CardDescription>Введіть ваш email та пароль нижче, для входу.</CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
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
                            <Button type='submit' disabled={uploading}>
                                {uploading ? <Loader2Icon className='w-5 h-5 animate-spin' /> : 'Увійти'}
                            </Button>
                            {error && <FormMessage type='error'>{serverErrors[error]}</FormMessage>}
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className='fixed bottom-4 right-4'>
                <ModeToggle />
            </div>
        </main>
    )
}
