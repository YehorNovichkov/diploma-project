const { parse } = require('dotenv')
const db = require('../db')

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
        const subject = await db.subject.findUnique({ where: { id: parseInt(id) } })
        res.json(subject)
    }

    async getSubjectsByName(req, res) {
        const { query } = req.body
        const sanitizedQuery = query.trim().toLowerCase()
        const subjects = await db.subject.findMany({
            where: { name: { contains: sanitizedQuery, mode: 'insensitive' } },
        })
        res.json(subjects)
    }

    async updateSubject(req, res) {
        const { id } = req.params
        const { name } = req.body
        const subject = await db.subject.update({
            where: { id: parseInt(id) },
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

module.exports = new SubjectController()
