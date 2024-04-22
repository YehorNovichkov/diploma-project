'use client'

import { createContext, useContext } from 'react'
import UserStore from '@/stores/userStore'

const AppContext = createContext()

export function AppWrapper({ children }) {
    return (
        <AppContext.Provider value={{ user: new UserStore() }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}
