import { $authHost, $host } from './_index'

export const createSubject = async (name) => {
    const { data } = await $host.post('api/subject', {
        name,
    })
    return data
}

export const fetchSubjects = async () => {
    const { data } = await $host.get('api/subject')
    return data
}

export const fetchSubject = async (id) => {
    const { data } = await $host.get(`api/subject/${id}`)
    return data
}

export const updateSubject = async (id, name) => {
    const { data } = await $authHost.put(`api/subject/${id}`, {
        name,
    })
    return data
}

export const deleteSubject = async (id) => {
    const { data } = await $authHost.delete(`api/subject/${id}`)
    return data
}
