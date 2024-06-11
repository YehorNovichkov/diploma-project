import * as z from 'zod'

export const taskSchema = z.object({
    name: z.string().min(1, { message: 'Назва завдання не може бути пустою' }),
    description: z.string().trim().optional(),
    deadline: z.date().min(new Date(), { message: 'Дата не може бути в минулому' }),
    subjectId: z.number(),
    classId: z.number(),
})
