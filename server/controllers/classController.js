const db = require('../db')

class ClassController {
    async createClass(req, res) {
        try {
            const { name } = req.body

            const newClass = await db.class.create({
                data: { name },
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

        const idInt = parseInt(id)
        const classObj = await db.class.findUnique({ where: { id: idInt } })

        res.json(classObj)
    }

    /**
     * strips all non-alphanumeric characters from the query and searches for classes that contain the query
     * @param {*} req
     * @param {*} res
     */
    async getClassesByName(req, res) {
        const { query } = req.body
        const sanitizedQuery = query.replace(/[^a-zA-Zа-яА-Я0-9]/g, '').toLowerCase()
        const classes = await db.$queryRaw`
            SELECT * FROM "Class"
            WHERE REPLACE(LOWER("name"), '-', '') LIKE ${'%' + sanitizedQuery + '%'}
        `

        res.json(classes)
    }

    async updateClass(req, res) {
        const { id } = parseInt(req.params)
        const { name } = req.body

        const updatedClass = await db.class.update({
            where: { id },
            data: { name },
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
