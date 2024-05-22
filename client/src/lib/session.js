import { getSession } from 'next-auth/react'
import { authOptions } from '@/lib/auth'

export async function getCurrentUserAccessToken() {
    const session = await getSession(authOptions)
    return session?.accessToken
}
