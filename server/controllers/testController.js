const db = require('../db')

class TestController {
    async createTest(req, res) {
        const { name, deadline, timeLimit, subjectId, classId } = req.body
        const test = await db.test.create({
            data: {
                name,
                deadline,
                timeLimit,
                subject: { connect: { id: subjectId } },
                class: { connect: { id: classId } },
            },
        })
        res.json(test)
    }

    async getTests(req, res) {
        const {
            limit = 10,
            page = 1,
            sort = 'deadline',
            sortDirection = 'asc',
            classId = null,
            subjectId = null,
            includeOverdue = 'true',
            name = null,
            hidden = null,
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
        if (hidden !== null) {
            const showHidden = hidden === 'true'
            filters.hidden = showHidden
        }

        const includeOverdueBool = includeOverdue === 'true'

        if (!includeOverdueBool) {
            filters.deadline = { gte: new Date() }
        }

        const tests = await db.test.findMany({
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
        const total = await db.test.count({ where: filters })

        res.json({ tests, total })
    }

    async getOneTest(req, res) {
        const { id } = req.params
        const test = await db.test.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                class: true,
                subject: true,
            },
        })
        res.json(test)
    }

    async updateTest(req, res) {
        const { id } = req.params
        const { name, deadline, timeLimit, subjectId, classId } = req.body
        const test = await db.test.update({
            where: { id: parseInt(id, 10) },
            data: {
                name,
                deadline,
                timeLimit,
                subject: { connect: { id: subjectId } },
                class: { connect: { id: classId } },
            },
            include: {
                class: true,
                subject: true,
            },
        })
        res.json(test)
    }

    async updateHiddenTest(req, res) {
        const { id } = req.params
        const { hidden } = req.body
        const test = await db.test.update({
            where: { id: parseInt(id, 10) },
            data: {
                hidden,
            },
        })
        res.json(test)
    }

    async deleteTest(req, res) {
        const { id } = req.params
        const test = await db.test.delete({ where: { id } })
        res.json(test)
    }
}

module.exports = new TestController()
