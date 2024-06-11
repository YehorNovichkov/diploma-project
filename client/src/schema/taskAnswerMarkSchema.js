import * as z from 'zod'

export const taskAnswerMarkSchema = z.object({
    mark: z.number().int().min(1, 'Оцінка повинна бути не менше 1').max(12, 'Оцінка повинна бути не більше 12'),
})
