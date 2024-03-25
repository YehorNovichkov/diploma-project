import db from '../db.js'

class StudentsTaskAnswerController {
    async createStudentsTaskAnswer(req, res) {
        try {
            const { studentId, taskId, text, file } = req.body
            const studentsTaskAnswer = await db.studentsTaskAnswer.create({
                data: {
                    student: { connect: { id: studentId } },
                    task: { connect: { id: taskId } },
                    text,
                    file,
                },
            })
            res.json(studentsTaskAnswer)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getStudentsTaskAnswers(req, res) {
        const studentsTaskAnswers = await db.studentsTaskAnswer.findMany()
        res.json(studentsTaskAnswers)
    }

    async getOneStudentsTaskAnswer(req, res) {
        const { id } = req.params
        const studentsTaskAnswer = await db.studentsTaskAnswer.findUnique({
            where: { id },
        })
        res.json(studentsTaskAnswer)
    }

    async updateStudentsTaskAnswer(req, res) {
        const { id } = req.params
        const { studentId, taskId, text, file } = req.body
        const studentsTaskAnswer = await db.studentsTaskAnswer.update({
            where: { id },
            data: {
                student: { connect: { id: studentId } },
                task: { connect: { id: taskId } },
                text,
                file,
            },
        })
        res.json(studentsTaskAnswer)
    }

    async deleteStudentsTaskAnswer(req, res) {
        const { id } = req.params
        const studentsTaskAnswer = await db.studentsTaskAnswer.delete({
            where: { id },
        })
        res.json(studentsTaskAnswer)
    }
}

export default new StudentsTaskAnswerController()
