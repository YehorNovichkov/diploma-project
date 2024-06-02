import { getCurrentUserAccessToken } from '@/lib/session'
import axios from 'axios'

const $host = axios.create({
    baseURL: 'http://localhost:4000/',
})

const $authHost = axios.create({
    baseURL: 'http://localhost:4000/',
})

const authInterceptor = async (config) => {
    const token = await getCurrentUserAccessToken()
    if (token) {
        config.headers.authorization = `Bearer ${token}`
    }
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export { $host, $authHost }
