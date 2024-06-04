import * as z from 'zod'

export const userRegisterSchema = z
    .object({
        email: z.string().email({ message: 'Невірний формат email' }),
        password: z.string().min(8, { message: 'Пароль повинен містити мінімум 8 символів' }),
        repeatPassword: z.string().min(8, { message: 'Пароль повинен містити мінімум 8 символів' }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: 'Паролі не співпадають',
        path: ['repeatPassword'],
    })
