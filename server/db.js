import { PrismaClient } from '@prisma/client'

export const db = window.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    if (window) {
        window.prisma = db
    }
}
