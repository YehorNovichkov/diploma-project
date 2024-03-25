import db from '../db.js'

class TaskAnswerController {
    async createAnswer(req, res) {
        try {
            const { text, file, taskId, studentId } = req.body
            const answer = await db.taskAnswer.create({
                data: {
                    text,
                    file,
                    task: { connect: { id: taskId } },
                    student: { connect: { id: studentId } },
                },
            })
            res.json(answer)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAnswers(req, res) {
        const answers = await db.taskAnswer.findMany()
        res.json(answers)
    }

    async getOneAnswer(req, res) {
        const { id } = req.params
        const answer = await db.taskAnswer.findUnique({ where: { id } })
        res.json(answer)
    }

    async updateAnswer(req, res) {
        const { id } = req.params
        const { text, file, taskId, studentId } = req.body
        const answer = await db.taskAnswer.update({
            where: { id },
            data: {
                text,
                file,
                task: { connect: { id: taskId } },
                student: { connect: { id: studentId } },
            },
        })
        res.json(answer)
    }

    async deleteAnswer(req, res) {
        const { id } = req.params
        const answer = await db.taskAnswer.delete({ where: { id } })
        res.json(answer)
    }
}

export default new TaskAnswerController()
