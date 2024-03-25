import db from '../db.js'

class TestAnswerController {
    async createAnswer(req, res) {
        try {
            const { text, file, isCorrect, questionId } = req.body
            const answer = await db.answer.create({
                data: {
                    text,
                    file,
                    isCorrect,
                    question: { connect: { id: questionId } },
                },
            })
            res.json(answer)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAnswers(req, res) {
        const answers = await db.answer.findMany()
        res.json(answers)
    }

    async getOneAnswer(req, res) {
        const { id } = req.params
        const answer = await db.answer.findUnique({ where: { id } })
        res.json(answer)
    }

    async updateAnswer(req, res) {
        const { id } = req.params
        const { text, file, isCorrect, questionId } = req.body
        const answer = await db.answer.update({
            where: { id },
            data: {
                text,
                file,
                isCorrect,
                question: { connect: { id: questionId } },
            },
        })
        res.json(answer)
    }

    async deleteAnswer(req, res) {
        const { id } = req.params
        const answer = await db.answer.delete({ where: { id } })
        res.json(answer)
    }
}

export default new TestAnswerController()
