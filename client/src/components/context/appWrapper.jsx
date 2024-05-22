'use client'

import { createContext, useContext } from 'react'
import UserStore from '@/stores/userStore'

const AppContext = createContext()
const userStore = new UserStore()

export function AppWrapper({ children }) {
    return (
        <AppContext.Provider value={{ userStore: userStore }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}
