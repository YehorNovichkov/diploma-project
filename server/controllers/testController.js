const db = require('../db')

class TestController {
    async createTest(req, res) {
        try {
            const { name, description, deadline, subjectId, classId } = req.body
            const test = await db.test.create({
                data: {
                    name,
                    description,
                    deadline,
                    subject: { connect: { id: subjectId } },
                    class: { connect: { id: classId } },
                },
            })
            res.json(test)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getTests(req, res) {
        const tests = await db.test.findMany()
        res.json(tests)
    }

    async getOneTest(req, res) {
        const { id } = req.params
        const test = await db.test.findUnique({ where: { id } })
        res.json(test)
    }

    async updateTest(req, res) {
        const { id } = req.params
        const { name, description, deadline, subjectId, classId } = req.body
        const test = await db.test.update({
            where: { id },
            data: {
                name,
                description,
                deadline,
                subject: { connect: { id: subjectId } },
                class: { connect: { id: classId } },
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
