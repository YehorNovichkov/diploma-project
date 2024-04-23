const db = require('../db')
const ApiError = require('../error/apiError.js')
const validate = require('../utils/serverEmailAndPasswordValidation.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.SECRET_KEY, {
        expiresIn: '24h',
    })
}

class UserController {
    async registration(req, res, next) {
        const { email, password, name, surname, patronymic } = req.body

        if (!validate(email, password)) {
            return next(ApiError.badRequest('invalid email or password'))
        }

        const candidate = await db.user.findUnique({ where: { email } })
        if (candidate) {
            return next(
                ApiError.badRequest('user with this email already exists')
            )
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const user = await db.user.create({
            data: {
                email,
                passwordHash: hashPassword,
                name,
                surname,
                patronymic,
            },
        })
        const token = generateToken(user.id, user.email)
        return res.json({ token })
    }

    async login(req, res, next) {
        const { email, password } = req.body

        if (!validate(email, password)) {
            return next(ApiError.badRequest('invalid email or password'))
        }

        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
            return next(
                ApiError.badRequest('user with specified email is not found')
            )
        }

        let comparePassword = bcrypt.compareSync(password, user.passwordHash)
        if (!comparePassword) {
            return next(ApiError.badRequest('wrong password'))
        }

        const token = generateToken(user.id, user.email)
        return res.json({ token })
    }

    async check(req, res, next) {
        const token = generateToken(req.user.id, req.user.email)
        res.json({ token })
    }

    async getUser(req, res, next) {
        const { id } = req.params
        const user = await db.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                patronymic: true,
            },
        })
        res.json(user)
    }
}

module.exports = new UserController()
