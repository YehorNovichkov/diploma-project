import * as z from 'zod'

export const taskAnswerSchema = z.object({
    text: z.string().trim().min(1, 'Поле не може бути порожнім'),
    isCorrect: z.boolean(),
})
