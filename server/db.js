const { PrismaClient } = require('@prisma/client')

// const db = window.prisma || new PrismaClient()
const db = new PrismaClient()

/* if (process.env.NODE_ENV !== 'production') {
    if (window) {
        window.prisma = db
    }
} */

module.exports = db
