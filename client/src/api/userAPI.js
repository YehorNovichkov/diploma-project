import { jwtDecode } from 'jwt-decode'
import { $authHost, $host } from './_index'

export const registration = async (email, password) => {
    const { data } = await $host.post('api/user/registration', {
        email,
        password,
    })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password })
    // localStorage.setItem('token', data.token)
    // createEncryptedCookie('token', data.token)
    return jwtDecode(data.token)
}

export const getToken = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password })
    return data
}

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchUser = async (id) => {
    const { data } = await $host.get(`api/user/${id}`)
    return data
}

/* export const restoreSession = async () => {
    const token = getDecryptedCookie('token')
    localStorage.setItem('token', token)
    user.setUser(data)
    user.setIsAuth(true)
} */
