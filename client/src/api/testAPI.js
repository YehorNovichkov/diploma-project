import { $authHost } from './_index'

export const fetchTest = async (id) => {
    const { data } = await $authHost.get(`api/test/${id}`)
    return data
}

export const fetchTests = async (
    limit = 10,
    page = 1,
    sort = 'deadline',
    sortDirection = 'asc',
    classId = null,
    subjectId = null,
    includeOverdue = 'true',
    name = null
) => {
    const params = new URLSearchParams()

    params.append('limit', limit)
    params.append('page', page)
    params.append('sort', sort)
    params.append('sortDirection', sortDirection)
    params.append('includeOverdue', includeOverdue)

    if (classId) params.append('classId', classId)
    if (subjectId) params.append('subjectId', subjectId)
    if (name) params.append('name', name)

    const { data } = await $authHost.get('api/test', { params })
    return data
}

export const createTest = async (name, deadline, timeLimit, classId, subjectId) => {
    const { data } = await $authHost.post('api/test', {
        name,
        deadline,
        timeLimit,
        classId,
        subjectId,
    })
    return data
}

export const updateTest = async (id, name, deadline, timeLimit, classId, subjectId) => {
    const { data } = await $authHost.put(`api/test/${id}`, {
        name,
        deadline,
        timeLimit,
        classId,
        subjectId,
    })
    return data
}

export const deleteTest = async (id) => {
    const { data } = await $authHost.delete(`api/test/${id}`)
    return data
}
