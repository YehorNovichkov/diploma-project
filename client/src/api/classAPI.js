import { $authHost } from './_index'

export const createClass = async (name) => {
    const { data } = await $authHost.post('api/class', {
        name,
    })
    return data
}

export const fetchClasses = async () => {
    const { data } = await $authHost.get('api/class')
    return data
}

export const fetchClass = async (id) => {
    const { data } = await $authHost.get(`api/class/${id}`)
    return data
}

export const updateClass = async (id, name) => {
    const { data } = await $authHost.put(`api/class/${id}`, {
        name,
    })
    return data
}

export const deleteClass = async (id) => {
    const { data } = await $authHost.delete(`api/class/${id}`)
    return data
}

export const fetchClassesByName = async (query) => {
    const { data } = await $authHost.post('api/class/search', {
        query,
    })
    return data
}
