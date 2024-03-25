import db from '../db.js'

class QuestionController {
    async createQuestion(req, res) {
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

    async getQuestions(req, res) {
        const questions = await db.question.findMany()
        res.json(questions)
    }

    async getOneQuestion(req, res) {
        const { id } = req.params
        const question = await db.question.findUnique({ where: { id } })
        res.json(question)
    }

    async updateQuestion(req, res) {
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

    async deleteQuestion(req, res) {
        const { id } = req.params
        const question = await db.question.delete({ where: { id } })
        res.json(question)
    }
}

export default new QuestionController()
