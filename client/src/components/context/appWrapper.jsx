'use client'

import ParentStore from '@/stores/parentStore'
import UserStore from '@/stores/userStore'
import { createContext, useContext } from 'react'

const AppContext = createContext()
const userStore = new UserStore()
const parentStore = new ParentStore()

export function AppWrapper({ children }) {
    return <AppContext.Provider value={{ userStore: userStore, parentStore: parentStore }}>{children}</AppContext.Provider>
}

export function useAppContext() {
    return useContext(AppContext)
}
