import * as z from 'zod'

export const testAnswerSchema = z.object({
    text: z.string().min(1, { message: 'Відповідь не може бути пустою' }),
    isCorrect: z.boolean(),
    testQuestionId: z.number(),
})
