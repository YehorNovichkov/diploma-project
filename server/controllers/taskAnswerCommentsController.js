const db = require('../db')

class TaskAnswerCommentsController {
    async createTaskAnswerComment({ text, taskAnswerId, authorId }) {
        const comment = await db.taskAnswerComments.create({
            data: {
                text,
                taskAnswer: { connect: { id: parseInt(taskAnswerId) } },
                author: { connect: { id: authorId } },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        patronymic: true,
                    },
                },
            },
        })
        return comment
    }

    async getTaskAnswerCommentsByTaskAnswer(req, res) {
        const { taskAnswerId } = req.params
        const comments = await db.taskAnswerComments.findMany({
            where: { taskAnswerId: parseInt(taskAnswerId) },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        patronymic: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        })
        res.json(comments)
    }
}

module.exports = new TaskAnswerCommentsController()
