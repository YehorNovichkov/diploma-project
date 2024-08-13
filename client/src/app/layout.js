import { AppWrapper } from '@/components/context/appWrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Learn.it',
    description: 'Система виконання завдань та тестів',
}

export default function RootLayout({ children }) {
    return (
        <html lang='ua'>
            <head />
            <body className={inter.className}>
                <AppWrapper>
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </AppWrapper>
            </body>
        </html>
    )
}
