import { $authHost } from './_index'

export const createSubject = async (name) => {
    const { data } = await $authHost.post('api/subject', {
        name,
    })
    return data
}

export const fetchSubjects = async () => {
    const { data } = await $authHost.get('api/subject')
    return data
}

export const fetchSubject = async (id) => {
    const { data } = await $authHost.get(`api/subject/${id}`)
    return data
}

export const fetchSubjectsByName = async (query) => {
    const { data } = await $authHost.post(`api/subject/search`, {
        query,
    })
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
