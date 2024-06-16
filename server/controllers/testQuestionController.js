const db = require('../db')

class TestQuestionController {
    async createTestQuestion(req, res) {
        const { text, isManual, testId } = req.body
        const question = await db.testQuestion.create({
            data: {
                text,
                isManual,
                test: { connect: { id: parseInt(testId) } },
            },
        })
        res.json(question)
    }

    async getTestQuestions(req, res) {
        const questions = await db.testQuestion.findMany()
        res.json(questions)
    }

    async getTestQuestionsByTestId(req, res) {
        const { testId } = req.params
        const questions = await db.testQuestion.findMany({ where: { testId: parseInt(testId) } })
        res.json(questions)
    }

    async getTestQuestionIdsByTestId(req, res) {
        const { testId } = req.params
        const questions = await db.testQuestion.findMany({
            where: { testId: parseInt(testId) },
            select: { id: true },
        })
        res.json(questions)
    }

    async getOneTestQuestion(req, res) {
        const { id } = req.params
        const question = await db.testQuestion.findUnique({ where: { id: parseInt(id) } })
        res.json(question)
    }

    async updateTestQuestion(req, res) {
        const { id } = req.params
        const { text, isManual, testId } = req.body
        const question = await db.testQuestion.update({
            where: { id: parseInt(id) },
            data: {
                text,
                isManual,
                test: { connect: { id: testId } },
            },
        })
        res.json(question)
    }

    async updateTestQuestionFilesCount(req, res) {
        const { id } = req.params
        const { filesCount } = req.body
        const question = await db.testQuestion.update({
            where: { id: parseInt(id) },
            data: {
                filesCount,
            },
        })
        res.json(question)
    }

    async deleteTestQuestion(req, res) {
        const { id } = req.params
        const question = await db.testQuestion.delete({ where: { id: parseInt(id) } })
        res.json(question)
    }
}

module.exports = new TestQuestionController()
