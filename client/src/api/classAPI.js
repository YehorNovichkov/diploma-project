import { $authHost, $host } from './_index'

export const createClass = async (name, userId) => {
    const { data } = await $host.post('api/class', {
        name,
        userId,
    })
    return data
}

export const fetchClasses = async () => {
    const { data } = await $host.get('api/class')
    return data
}

export const fetchClass = async (id) => {
    const { data } = await $host.get(`api/class/${id}`)
    return data
}

export const updateClass = async (id, name, description, teacherId) => {
    const { data } = await $authHost.put(`api/class/${id}`, {
        name,
        description,
        teacherId,
    })
    return data
}

export const deleteClass = async (id) => {
    const { data } = await $authHost.delete(`api/class/${id}`)
    return data
}
