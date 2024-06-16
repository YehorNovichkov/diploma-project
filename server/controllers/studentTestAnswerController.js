const db = require('../db')

class StudentTestAnswerController {
    async createStudentTestAnswers(req, res) {
        const { resultId, questionId, answerIds, manualAnswer } = req.body
        const question = await db.testQuestion.findUnique({
            where: { id: questionId },
        })

        if (!question) {
            return res.status(400).json({ error: 'Question not found' })
        }

        if (question.isManual) {
            if (!manualAnswer) {
                return res.status(400).json({ error: 'Manual answer is required for this question' })
            }

            const studentAnswer = await db.studentTestAnswer.create({
                data: {
                    resultId: parseInt(resultId),
                    questionId: parseInt(questionId),
                    manualAnswer,
                },
            })

            res.json(studentAnswer)
        } else {
            if (!Array.isArray(answerIds) || answerIds.length === 0) {
                return res.status(400).json({ error: 'Invalid answerIds' })
            }

            const validAnswers = await db.testAnswer.findMany({
                where: {
                    id: { in: answerIds },
                    questionId: questionId,
                },
            })

            if (validAnswers.length !== answerIds.length) {
                return res.status(400).json({ error: 'One or more provided answers are invalid' })
            }

            const studentAnswers = await Promise.all(
                answerIds.map((answerId) =>
                    db.studentTestAnswer.create({
                        data: {
                            resultId: parseInt(resultId),
                            questionId: parseInt(questionId),
                            answerId: parseInt(answerId),
                        },
                    })
                )
            )

            res.json(studentAnswers)
        }
    }

    async getStudentTestAnswers(req, res) {
        const studentTestAnswers = await db.studentTestAnswer.findMany()
        res.json(studentTestAnswers)
    }

    async getStudentTestAnswersByResultIdQuestionId(req, res) {
        const { resultId, questionId } = req.body
        const studentTestAnswers = await db.studentTestAnswer.findMany({
            where: { resultId: parseInt(resultId), questionId: parseInt(questionId) },
        })
        res.json(studentTestAnswers)
    }

    async getOneStudentTestAnswer(req, res) {
        const { id } = req.params
        const studentTestAnswer = await db.studentTestAnswer.findUnique({ where: { id } })
        res.json(studentTestAnswer)
    }

    async updateStudentTestAnswer(req, res) {
        const { id } = req.params
        const { studentId, testId, questionId, answer } = req.body
        const studentTestAnswer = await db.studentTestAnswer.update({
            where: { id },
            data: {
                student: { connect: { id: studentId } },
                test: { connect: { id: parseInt(testId) } },
                question: { connect: { id: parseInt(questionId) } },
                answer,
            },
        })
        res.json(studentTestAnswer)
    }

    async deleteStudentTestAnswer(req, res) {
        const { id } = req.params
        const studentTestAnswer = await db.studentTestAnswer.delete({ where: { id } })
        res.json(studentTestAnswer)
    }
}

module.exports = new StudentTestAnswerController()
