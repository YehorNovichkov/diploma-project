import * as z from 'zod'

export const testSchema = z.object({
    name: z.string().min(1, { message: 'Назва завдання не може бути пустою' }),
    deadline: z.date().min(new Date(), { message: 'Дата не може бути в минулому' }),
    timeLimit: z.number().int().min(1, { message: 'Тривалість тесту не може бути менше 1 хвилини' }),
    subjectId: z.number(),
    classId: z.number(),
})
