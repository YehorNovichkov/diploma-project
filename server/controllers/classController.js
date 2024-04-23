const db = require('../db')

class ClassController {
    async createClass(req, res) {
        try {
            const { name, userId } = req.body

            const newClass = await db.class.create({
                data: { name, userId },
            })

            res.json(newClass)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getClasses(req, res) {
        const classes = await db.class.findMany()

        res.json(classes)
    }

    async getOneClass(req, res) {
        const { id } = req.params

        const classObj = await db.class.findUnique({ where: { id } })

        res.json(classObj)
    }

    async updateClass(req, res) {
        const { id } = req.params
        const { name, teacher, students } = req.body

        const updatedClass = await db.class.update({
            where: { id },
            data: { name, teacher, students },
        })

        res.json(updatedClass)
    }

    async deleteClass(req, res) {
        const { id } = req.params

        const deletedClass = await db.class.delete({ where: { id } })

        res.json(deletedClass)
    }
}

module.exports = new ClassController()
