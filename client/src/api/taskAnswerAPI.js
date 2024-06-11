import { $authHost } from './_index'

export const createTaskAnswer = async (text, taskId, studentId) => {
    const { data } = await $authHost.post('api/taskAnswer', {
        text,
        taskId,
        studentId,
    })
    return data
}

export const fetchTaskAnswers = async () => {
    const { data } = await $authHost.get('api/taskAnswer')
    return data
}

export const fetchTaskAnswer = async (taskAnswerId) => {
    const { data } = await $authHost.get(`api/taskAnswer/${taskAnswerId}`)
    return data
}

export const fetchTaskAnswersByTask = async (taskId) => {
    const { data } = await $authHost.get(`api/taskAnswer/byTask/${taskId}`)
    return data
}

export const fetchTaskAnswerByTaskAndStudent = async (taskId, studentId) => {
    const params = new URLSearchParams()
    params.append('taskId', taskId)
    params.append('studentId', studentId)

    const { data } = await $authHost.get('api/taskAnswer/byTaskAndStudent', { params })
    return data
}

export const updateTaskAnswerFilesCount = async (id, filesCount) => {
    const { data } = await $authHost.patch(`api/taskAnswer/${id}`, { filesCount })
    return data
}

export const updateTaskAnswerMark = async (id, mark) => {
    const { data } = await $authHost.patch(`api/taskAnswer/mark/${id}`, { mark })
    return data
}
