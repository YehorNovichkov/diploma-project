import * as z from 'zod'

export const userSchema = z
    .object({
        name: z.string().min(1, { message: "Ім'я обов'язкове" }),
        surname: z.string().min(1, { message: "Прізвище обов'язкове" }),
        patronymic: z.string().min(1, { message: "По-батькові обов'язкове" }),
        roles: z.array(z.string()).nonempty({ message: 'Користувач повинен мати хоча б одну роль' }),
        // student fields
        classQuery: z.string().optional(),
        classId: z.string().optional(),
        parentQuery: z.string().optional(),
        parentId: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.roles.includes('student')) {
                return !!data.classId && !!data.parentId
            }
            return true
        },
        {
            message: 'Учень повинен мати клас та батьків',
            path: ['classQuery', 'parentQuery'],
        }
    )
