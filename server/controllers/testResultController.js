const db = require('../db')

class TestResultController {
    async createTestResult(req, res) {
        const { studentId, testId } = req.body
        const testResult = await db.testResult.create({
            data: {
                student: { connect: { id: studentId } },
                test: { connect: { id: parseInt(testId) } },
            },
        })
        res.json(testResult)
    }

    async getTestResultsByTestId(req, res) {
        const { testId } = req.params
        const testResults = await db.testResult.findMany({
            where: { testId: parseInt(testId) },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        patronymic: true,
                    },
                },
            },
        })
        res.json(testResults)
    }

    async getTestResultsByStudentId(req, res) {
        const { studentId } = req.params
        const testResults = await db.testResult.findMany({
            where: { studentId: studentId },
            include: {
                test: {
                    include: {
                        class: true,
                        subject: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        patronymic: true,
                    },
                },
            },
        })
        res.json(testResults)
    }

    async getOneTestResult(req, res) {
        const { id } = req.params
        const testResult = await db.testResult.findUnique({
            where: { id: parseInt(id) },
            include: {
                answers: {
                    include: {
                        answer: true,
                        question: {
                            include: {
                                testAnswers: true,
                            },
                        },
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        patronymic: true,
                    },
                },
                test: {
                    include: {
                        class: true,
                        subject: true,
                        questions: true,
                    },
                },
            },
        })
        res.json(testResult)
    }

    async getTestResultByStudentIdTestId(req, res) {
        const { studentId, testId } = req.body
        const testResult = await db.testResult.findFirst({
            where: { studentId: studentId, testId: parseInt(testId) },
        })
        res.json(testResult)
    }

    async updateTestResult(req, res) {
        const { id } = req.params
        const { studentId, testId } = req.body
        const testResult = await db.testResult.update({
            where: { id },
            data: {
                student: { connect: { id: studentId } },
                test: { connect: { id: testId } },
            },
        })
        res.json(testResult)
    }

    async completeTestResult(req, res) {
        const { id } = req.params
        const testResultId = parseInt(id)

        const testResult = await db.testResult.findUnique({
            where: { id: testResultId },
            include: {
                answers: {
                    include: {
                        answer: true,
                        question: {
                            include: {
                                testAnswers: true,
                            },
                        },
                    },
                },
            },
        })

        if (!testResult) {
            return res.status(404).json({ error: `TestResult with ID ${testResultId} not found.` })
        }

        const completedAt = new Date()

        let totalConsideredAnswers = 0
        let correctAnswers = 0

        testResult.answers.forEach((studentAnswer) => {
            const question = studentAnswer.question

            const correctTestAnswers = question.testAnswers.filter((testAnswer) => testAnswer.isCorrect)
            const hasCorrectAnswers = correctTestAnswers.length > 0
            const hasAnyAnswers = question.testAnswers.length > 0

            if (!hasAnyAnswers || !hasCorrectAnswers) {
                return
            }

            if (question.isManual) {
                const correctManualAnswers = correctTestAnswers.map((testAnswer) => testAnswer.text.toLowerCase().trim())

                if (correctManualAnswers.includes(studentAnswer.manualAnswer?.toLowerCase().trim())) {
                    correctAnswers++
                }
            } else {
                const studentAnswersForQuestion = testResult.answers.filter((ans) => ans.questionId === question.id)

                const correctStudentAnswers = studentAnswersForQuestion.filter(
                    (ans) => ans.answer && correctTestAnswers.some((correctAnswer) => correctAnswer.id === ans.answer.id)
                )

                if (correctStudentAnswers.length === correctTestAnswers.length) {
                    correctAnswers++
                } else {
                    correctAnswers += correctStudentAnswers.length / correctTestAnswers.length
                }
            }

            totalConsideredAnswers++
        })

        const mark = totalConsideredAnswers > 0 ? correctAnswers / totalConsideredAnswers : 0

        const result = await db.testResult.update({
            where: { id: testResultId },
            data: {
                completedAt,
                mark,
            },
        })

        res.json(result)
    }

    async getAvarageMarkByStudentId(req, res) {
        const { studentId } = req.params
        const aggregations = await db.testResult.aggregate({
            _avg: {
                mark: true,
            },
            where: {
                studentId,
            },
        })

        res.json({ avgMark: aggregations._avg.mark })
    }

    async deleteTestResult(req, res) {
        const { id } = req.params
        const testResult = await db.testResult.delete({ where: { id } })
        res.json(testResult)
    }
}

module.exports = new TestResultController()
