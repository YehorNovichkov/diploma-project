import * as z from 'zod'

export const studentTestAnswerSchema = z.object({
    selectedAnswerIds: z.array(z.number().or(z.string())).min(1, 'Виберіть хоча б одну відповідь'),
})
