const db = require('../db')

class TaskAnswerController {
    async createTaskAnswer(req, res) {
        const { text, taskId, studentId } = req.body
        const answer = await db.taskAnswer.create({
            data: {
                text,
                task: { connect: { id: parseInt(taskId) } },
                student: { connect: { id: studentId } },
            },
        })
        res.json(answer)
    }

    async getTaskAnswers(req, res) {
        const answers = await db.taskAnswer.findMany({ include: { student: true } })
        res.json(answers)
    }

    async getOneTaskAnswer(req, res) {
        const { id } = req.params
        const answer = await db.taskAnswer.findUnique({ where: { id: parseInt(id) }, include: { student: true } })
        res.json(answer)
    }

    async getTaskAnswersByTask(req, res) {
        const { taskId } = req.params
        const answers = await db.taskAnswer.findMany({
            where: { taskId: parseInt(taskId) },
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
        res.json(answers)
    }

    async getTaskAnswerByTaskAndStudent(req, res) {
        const { taskId, studentId } = req.query
        const answer = await db.taskAnswer.findFirst({
            where: { taskId: parseInt(taskId), studentId: studentId },
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
        res.json(answer)
    }

    async updateTaskAnswer(req, res) {
        const { id } = req.params
        const { text, taskId, studentId } = req.body
        const answer = await db.taskAnswer.update({
            where: { id: parseInt(id) },
            data: {
                text,
                file,
                task: { connect: { id: taskId } },
                student: { connect: { id: studentId } },
            },
        })
        res.json(answer)
    }

    async updateTaskAnswerFilesCount(req, res) {
        const { id } = req.params
        const { filesCount } = req.body
        const answer = await db.taskAnswer.update({
            where: { id: parseInt(id) },
            data: {
                filesCount,
            },
        })
        res.json(answer)
    }

    async updateTaskAnswerMark(req, res) {
        const { id } = req.params
        const { mark } = req.body
        const answer = await db.taskAnswer.update({
            where: { id: parseInt(id) },
            data: {
                mark,
            },
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
        res.json(answer)
    }

    async deleteTaskAnswer(req, res) {
        const { id } = req.params
        const answer = await db.taskAnswer.delete({ where: { id } })
        res.json(answer)
    }
}

module.exports = new TaskAnswerController()
