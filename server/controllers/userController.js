const db = require('../db')
const ApiError = require('../error/apiError.js')
const validate = require('../utils/serverEmailAndPasswordValidation.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateToken = (id, roles) => {
    return jwt.sign({ id, roles }, process.env.SECRET_KEY, {
        expiresIn: '30d',
    })
}

const getUserRolesWithoutRequest = async (id) => {
    const userRoles = await db.user.findUnique({
        where: { id: id },
        select: {
            roles: true,
        },
    })

    return userRoles.roles
}

class UserController {
    async registration(req, res, next) {
        const { id } = req.params
        const { email, password } = req.body

        if (!validate(email, password)) {
            return next(ApiError.badRequest('INVALID_DATA'))
        }

        const existingUser = await db.user.findUnique({ where: { id } })
        if (existingUser) {
            if (existingUser.email || existingUser.passwordHash) {
                return next(ApiError.badRequest('USER_ALREADY_HAS_EMAIL_AND_PASSWORD'))
            }
        } else {
            return next(ApiError.badRequest('USER_DOES_NOT_EXIST'))
        }

        const candidate = await db.user.findUnique({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest('EMAIL_EXISTS'))
        }

        const hashPassword = await bcrypt.hash(password, 5)
        const updatedUser = await db.user.update({
            where: { id: id },
            data: {
                email,
                passwordHash: hashPassword,
            },
        })

        const roles = await getUserRolesWithoutRequest(updatedUser.id)
        const token = generateToken(updatedUser.id, roles)
        return res.json({ token })
    }

    async login(req, res, next) {
        const { email, password } = req.body

        if (!validate(email, password)) {
            return next(ApiError.badRequest('INVALID_DATA'))
        }

        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest('EMAIL_NOT_FOUND'))
        }

        let comparePassword = bcrypt.compareSync(password, user.passwordHash)
        if (!comparePassword) {
            return next(ApiError.badRequest('WRONG_PASSWORD'))
        }

        const roles = await getUserRolesWithoutRequest(user.id)
        const token = generateToken(user.id, roles)
        return res.json({ token })
    }

    async addUser(req, res, next) {
        const { name, surname, patronymic, roles, classId, parentId } = req.body

        const newUser = await db.user.create({
            data: {
                name,
                surname,
                patronymic,
                roles,
                classId: classId === '' ? null : parseInt(classId),
                parentId: parentId === '' ? null : parentId,
            },
        })

        res.json(newUser)
    }

    async updateUser(req, res, next) {
        const { id } = req.params
        const { name, surname, patronymic, roles, classId, parentId } = req.body

        const updatedUser = await db.user.update({
            where: { id: id },
            data: {
                name,
                surname,
                patronymic,
                roles,
                classId: classId === '' ? null : parseInt(classId),
                parentId: parentId === '' ? null : parentId,
            },
        })

        res.json(updatedUser)
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
                roles: true,
                classId: true,
                parentId: true,
            },
        })
        res.json(user)
    }

    async getUserRoles(req, res, next) {
        const { id } = req.params
        const userRoles = await db.user.findUnique({
            where: { id: id },
            select: {
                roles: true,
            },
        })

        res.json(userRoles.roles)
    }

    async getUsersByRole(req, res, next) {
        const { role } = req.params
        const { limit = 10, page = 1 } = req.query
        const limitInt = parseInt(limit, 10)
        const pageInt = parseInt(page, 10)
        const offsetInt = (pageInt - 1) * limitInt

        const users = await db.user.findMany({
            where: { roles: { has: role } },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                patronymic: true,
                classId: true,
                parentId: true,
            },
            take: limitInt,
            skip: offsetInt,
        })

        const total = await db.user.count({
            where: { roles: { has: role } },
        })

        res.json({ users, total })
    }

    async getUsersByClass(req, res, next) {
        const { classId } = req.params
        const users = await db.user.findMany({
            where: { classId: parseInt(classId) },
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                patronymic: true,
                roles: true,
                parentId: true,
            },
        })

        res.json(users)
    }

    async getUsersByPartOfFullNameAndRole(req, res, next) {
        const { query, role } = req.body
        const { limit, offset = 0 } = req.query

        const offsetInt = parseInt(offset, 10)

        const terms = query
            .split(' ')
            .map((term) => term.trim())
            .filter((term) => term.length > 0)
        if (terms.length === 0) {
            return res.status(400).json({ message: 'Query parameter is empty' })
        }

        const searchConditions = terms.map((term) => ({
            OR: [
                { name: { contains: term, mode: 'insensitive' } },
                { surname: { contains: term, mode: 'insensitive' } },
                { patronymic: { contains: term, mode: 'insensitive' } },
            ],
        }))

        let roleCondition = {}
        if (role) {
            roleCondition = {
                roles: {
                    has: role,
                },
            }
        }

        const findManyParams = {
            where: {
                AND: [...searchConditions, roleCondition],
            },
            skip: offsetInt,
        }

        if (limit !== undefined) {
            findManyParams.take = parseInt(limit, 10)
        }

        const users = await db.user.findMany(findManyParams)
        res.json(users)
    }

    async getUserRolesWithoutRequest(id) {
        const userRoles = await db.user.findUnique({
            where: { id: id },
            select: {
                roles: true,
            },
        })

        return userRoles.roles
    }
}

module.exports = new UserController()
