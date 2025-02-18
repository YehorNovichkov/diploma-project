import DOMPurify from 'dompurify'
import { $authHost } from './_index'

export const createTask = async (name, description, deadline, classId, subjectId) => {
    const { data } = await $authHost.post('api/task', {
        name,
        description: DOMPurify.sanitize(description),
        deadline,
        classId,
        subjectId,
    })
    return data
}

export const fetchTasks = async (
    limit = 10,
    page = 1,
    sort = 'deadline',
    sortDirection = 'asc',
    classId = null,
    subjectId = null,
    includeOverdue = 'true',
    name = null,
    hidden = null
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
    if (hidden !== null) params.append('hidden', hidden)

    const { data } = await $authHost.get('/api/task', { params })

    return data
}

export const fetchTask = async (id) => {
    const { data } = await $authHost.get(`api/task/${id}`)
    return data
}

export const updateTask = async (id, name, description, deadline, classId, subjectId) => {
    const { data } = await $authHost.put(`api/task/${id}`, {
        name,
        description: DOMPurify.sanitize(description),
        deadline,
        classId,
        subjectId,
    })
    return data
}

export const updateTaskFilesCount = async (id, filesCount) => {
    const { data } = await $authHost.patch(`api/task/${id}`, { filesCount })
    return data
}

export const updateHiddenTask = async (id, hidden) => {
    const { data } = await $authHost.patch(`api/task/hidden/${id}`, { hidden })
    return data
}

export const deleteTask = async (id) => {
    const { data } = await $authHost.delete(`api/task/${id}`)
    return data
}
