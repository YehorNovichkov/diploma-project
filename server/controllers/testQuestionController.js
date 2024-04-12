import db from '../db.js'

class TestQuestionController {
    async createTestQuestion(req, res) {
        try {
            const { text, file, answers, manualAnswer, testId } = req.body
            const question = await db.question.create({
                data: {
                    text,
                    file,
                    answers,
                    manualAnswer,
                    test: { connect: { id: testId } },
                },
            })
            res.json(question)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getTestQuestions(req, res) {
        const questions = await db.question.findMany()
        res.json(questions)
    }

    async getOneTestQuestion(req, res) {
        const { id } = req.params
        const question = await db.question.findUnique({ where: { id } })
        res.json(question)
    }

    async updateTestQuestion(req, res) {
        const { id } = req.params
        const { text, file, answers, manualAnswer, testId } = req.body
        const question = await db.question.update({
            where: { id },
            data: {
                text,
                file,
                answers,
                manualAnswer,
                test: { connect: { id: testId } },
            },
        })
        res.json(question)
    }

    async deleteTestQuestion(req, res) {
        const { id } = req.params
        const question = await db.question.delete({ where: { id } })
        res.json(question)
    }
}

export default new TestQuestionController()
