const db = require('../db')

class TaskController {
    async createTask(req, res) {
        const { name, description, deadline, subjectId, classId } = req.body
        const task = await db.task.create({
            data: {
                name,
                description,
                deadline,
                subject: { connect: { id: subjectId } },
                class: { connect: { id: classId } },
            },
        })
        res.json(task)
    }

    async getTasks(req, res) {
        const {
            limit = 10,
            page = 1,
            sort = 'deadline',
            sortDirection = 'asc',
            classId = null,
            subjectId = null,
            includeOverdue = 'true',
            name = null,
        } = req.query

        const validSortFields = ['deadline', 'name', 'createdAt']
        const validSortDirections = ['asc', 'desc']

        const limitInt = Math.max(1, parseInt(limit, 10))
        const pageInt = Math.max(1, parseInt(page, 10))
        const offsetInt = (pageInt - 1) * limitInt

        const sortField = validSortFields.includes(sort) ? sort : 'deadline'
        const sortDir = validSortDirections.includes(sortDirection) ? sortDirection : 'asc'

        const filters = {}
        if (classId) filters.classId = parseInt(classId, 10)
        if (subjectId) filters.subjectId = parseInt(subjectId, 10)
        if (name) filters.name = { contains: name, mode: 'insensitive' }

        const includeOverdueBool = includeOverdue === 'true'

        if (!includeOverdueBool) {
            filters.deadline = { gte: new Date() }
        }

        const tasks = await db.task.findMany({
            where: filters,
            orderBy: {
                [sortField]: sortDir,
            },
            take: limitInt,
            skip: offsetInt,
            include: {
                class: true,
                subject: true,
            },
        })

        const total = await db.task.count({ where: filters })

        res.json({ tasks, total })
    }

    async getOneTask(req, res) {
        const { id } = req.params
        const task = await db.task.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                class: true,
                subject: true,
            },
        })
        res.json(task)
    }

    async updateTask(req, res) {
        const { id } = req.params
        const { name, description, deadline, files, answerTypes, subjectId, classId } = req.body
        const task = await db.task.update({
            where: { id: parseInt(id, 10) },
            data: {
                name,
                description,
                deadline,
                files,
                answerTypes,
                subject: { connect: { id: subjectId } },
                class: { connect: { id: classId } },
            },
            include: {
                class: true,
                subject: true,
            },
        })
        res.json(task)
    }

    async updateTaskFilesCount(req, res) {
        const { id } = req.params
        const { filesCount } = req.body
        const task = await db.task.update({
            where: { id: parseInt(id) },
            data: {
                filesCount,
            },
            include: {
                class: true,
                subject: true,
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

module.exports = new TaskController()
