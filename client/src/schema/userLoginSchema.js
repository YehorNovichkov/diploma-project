import * as z from 'zod'

export const userLoginSchema = z.object({
    email: z.string().email({ message: 'Невірний формат email' }),
    password: z.string().min(8, { message: 'Пароль повинен містити мінімум 8 символів' }),
})
