import { $authHost } from './_index'

export const createTaskAnswerComment = async (text, taskAnswerId, authorId) => {
    const { data } = await $authHost.post('api/taskAnswerComment', { text, taskAnswerId, authorId })
    return data
}

export const fetchTaskAnswerCommentsByTaskAnswer = async (taskAnswerId) => {
    const { data } = await $authHost.get(`api/taskAnswerComment/byTaskAnswer/${taskAnswerId}`)
    return data
}
