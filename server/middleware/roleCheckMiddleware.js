const jwt = require('jsonwebtoken')
const db = require('../db')
const { getUserRolesWithoutRequest } = require('../controllers/userController')

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

            const userRoles = await getUserRolesWithoutRequest(decoded.id)

            if (userRoles.every((r) => !role.includes(r))) {
                return res.status(403).json({ message: 'forbidden' })
            }

            next()
        } catch (e) {
            res.status(401).json({ message: 'unauthorised' })
        }
    }
}
