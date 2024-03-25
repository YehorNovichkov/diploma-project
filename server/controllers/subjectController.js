import db from '../db.js'

class SubjectController {
    async createSubject(req, res) {
        try {
            const { name } = req.body
            const subject = await db.subject.create({
                data: { name },
            })
            res.json(subject)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getSubjects(req, res) {
        const subjects = await db.subject.findMany()
        res.json(subjects)
    }

    async getOneSubject(req, res) {
        const { id } = req.params
        const subject = await db.subject.findUnique({ where: { id } })
        res.json(subject)
    }

    async updateSubject(req, res) {
        const { id } = req.params
        const { name } = req.body
        const subject = await db.subject.update({
            where: { id },
            data: { name },
        })
        res.json(subject)
    }

    async deleteSubject(req, res) {
        const { id } = req.params
        const subject = await db.subject.delete({ where: { id } })
        res.json(subject)
    }
}

export default new SubjectController()
