const db = require('../db')

class TestAnswerController {
    async createTestAnswer(req, res) {
        const { text, isCorrect, testQuestionId } = req.body
        const answer = await db.testAnswer.create({
            data: {
                text,
                isCorrect,
                question: { connect: { id: parseInt(testQuestionId) } },
            },
        })
        res.json(answer)
    }

    async getTestAnswers(req, res) {
        const answers = await db.testAnswer.findMany()
        res.json(answers)
    }

    async getTestAnswersByQuestionId(req, res) {
        const { testQuestionId } = req.params
        const answers = await db.testAnswer.findMany({ where: { questionId: parseInt(testQuestionId) } })
        res.json(answers)
    }

    async getOneTestAnswer(req, res) {
        const { id } = req.params
        const answer = await db.testAnswer.findUnique({ where: { id: parseInt(id) } })
        res.json(answer)
    }

    async updateTestAnswer(req, res) {
        const { id } = req.params
        const { text, file, isCorrect, questionId } = req.body
        const answer = await db.testAnswer.update({
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
        const answer = await db.testAnswer.delete({ where: { id: parseInt(id) } })
        res.json(answer)
    }
}

module.exports = new TestAnswerController()
