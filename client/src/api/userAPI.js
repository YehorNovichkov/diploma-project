import { $authHost, $host } from './_index'

export const registration = async (id, email, password) => {
    try {
        const { data } = await $host.put(`api/user/registration/${id}`, {
            email,
            password,
        })
        return data
    } catch (error) {
        if (error.response) {
            const { data } = error.response
            return data
        } else {
            return 'Помилка сервера'
        }
    }
}

export const addUser = async (name, surname, patronymic, roles, classId, parentId) => {
    const { data } = await $authHost.post('api/user', {
        name,
        surname,
        patronymic,
        roles,
        classId,
        parentId,
    })
    return data
}

export const updateUser = async (id, name, surname, patronymic, roles, classId = null, parentId = null) => {
    const { data } = await $authHost.put(`api/user/${id}`, {
        name,
        surname,
        patronymic,
        roles,
        classId,
        parentId,
    })
    return data
}

export const getToken = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password })
    return data
}

export const fetchUser = async (id) => {
    const { data } = await $authHost.get(`api/user/${id}`)
    return data
}

export const fetchUsersByRole = async (role, limit = 10, page = 1) => {
    const { data } = await $authHost.get(`api/user/by-role/${role}`, {
        params: {
            limit,
            page,
        },
    })
    return data
}

export const fetchUsersByClass = async (classId) => {
    const { data } = await $authHost.get(`api/user/by-class/${classId}`)
    return data
}

/**
 *
 * @param {String} fullName
 * @param {String} [role=null] optional
 * @returns users that contain *fullName* in their name, surname or patronymic and have specific *role* if provided
 */
export const fetchUsersByFullNameAndRole = async (query, role = null) => {
    const { data } = await $authHost.post('api/user/search', { query, role })

    return data
}

export const resetUser = async (id) => {
    const { data } = await $authHost.patch(`api/user/reset/${id}`)
    return data
}
