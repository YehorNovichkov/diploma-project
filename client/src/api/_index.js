import axios from 'axios'
import { getSession } from 'next-auth/react'

const $host = axios.create({
    baseURL: 'http://localhost:4000/',
})

const $authHost = axios.create({
    baseURL: 'http://localhost:4000/',
})

const authInterceptor = (config) => {
    const session = getSession()
    const token = session?.accessToken
    if (token) {
        console.log('token:', token)
        config.headers.authorization = `Bearer ${token}`
    }
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export { $host, $authHost }
