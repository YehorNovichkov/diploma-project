import db from '../db'

class TaskController {
    async createTask(req, res) {
        try {
            const {
                name,
                description,
                deadline,
                files,
                answerTypes,
                subjectId,
                classId,
            } = req.body
            const task = await db.task.create({
                data: {
                    name,
                    description,
                    deadline,
                    files,
                    answerTypes,
                    subject: { connect: { id: subjectId } },
                    class: { connect: { id: classId } },
                },
            })
            res.json(task)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getTasks(req, res) {
        const tasks = await db.task.findMany()
        res.json(tasks)
    }

    async getOneTask(req, res) {
        const { id } = req.params
        const task = await db.task.findUnique({ where: { id } })
        res.json(task)
    }

    async updateTask(req, res) {
        const { id } = req.params
        const {
            name,
            description,
            deadline,
            files,
            answerTypes,
            subjectId,
            classId,
        } = req.body
        const task = await db.task.update({
            where: { id },
            data: {
                name,
                description,
                deadline,
                files,
                answerTypes,
                subject: { connect: { id: subjectId } },
                class: { connect: { id: classId } },
            },
        })
        res.json(task)
    }

    async deleteTask(req, res) {
        const { id } = req.params
        const task = await db.task.delete({ where: { id } })
        res.json(task)
    }
}

export default new TaskController()
