import * as z from 'zod'

export const testQuestionSchema = z.object({
    text: z.string().min(1, { message: 'Текст питання не може бути пустим' }),
    isManual: z.boolean(),
})
