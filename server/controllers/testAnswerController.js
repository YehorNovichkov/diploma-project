const db = require('../db')

class TestAnswerController {
    async createTestAnswer(req, res) {
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

    async getTestAnswers(req, res) {
        const answers = await db.answer.findMany()
        res.json(answers)
    }

    async getOneTestAnswer(req, res) {
        const { id } = req.params
        const answer = await db.answer.findUnique({ where: { id } })
        res.json(answer)
    }

    async updateTestAnswer(req, res) {
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

    async deleteTestAnswer(req, res) {
        const { id } = req.params
        const answer = await db.answer.delete({ where: { id } })
        res.json(answer)
    }
}

module.exports = new TestAnswerController()
