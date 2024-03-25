import db from '../db.js'

/* class UserController {
    async createUser(req, res) {
        try {
            const { name, email, password } = req.body
            const user = await db.user.create({
                data: { name, email, password },
            })
            res.json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getUsers(req, res) {
        const users = await db.user.findMany()
        res.json(users)
    }

    async getOneUser(req, res) {
        const { id } = req.params
        const user = await db.user.findUnique({ where: { id } })
        res.json(user)
    }

    async updateUser(req, res) {
        const { id } = req.params
        const { name, email } = req.body
        const user = await db.user.update({
            where: { id },
            data: { name, email },
        })
        res.json(user)
    }

    async deleteUser(req, res) {
        const { id } = req.params
        const user = await db.user.delete({ where: { id } })
        res.json(user)
    }
}
*/
