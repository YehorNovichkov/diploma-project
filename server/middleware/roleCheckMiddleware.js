const jwt = require('jsonwebtoken')
const db = require('../db')

module.exports = function (role) {
    return async function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                res.status(401).json({ message: 'unauthorised' })
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded

            let userRole
            if (
                await db.student.findUnique({ where: { userId: decoded.id } })
            ) {
                userRole = 'student'
            } else if (
                await db.teacher.findUnique({ where: { userId: decoded.id } })
            ) {
                userRole = 'teacher'
            } else if (
                await db.admin.findUnique({ where: { userId: decoded.id } })
            ) {
                userRole = 'admin'
            } else if (
                await db.parent.findUnique({ where: { userId: decoded.id } })
            ) {
                userRole = 'parent'
            } else {
                return res.status(401).json({ message: 'unauthorised' })
            }

            if (!role.includes(userRole)) {
                return res.status(403).json({ message: 'forbidden' })
            }

            next()
        } catch (e) {
            res.status(401).json({ message: 'unauthorised' })
        }
    }
}
