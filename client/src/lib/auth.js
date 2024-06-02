import { getToken } from '@/api/userAPI'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            async authorize(credentials) {
                try {
                    const user = await getToken(credentials.email, credentials.password)
                    if (user) {
                        return user
                    }
                } catch (error) {
                    throw new Error(`Authentication failed (${error})`)
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token
            }

            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken

            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NEXT_ENV === 'development',
}
