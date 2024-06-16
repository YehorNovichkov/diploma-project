import { $authHost } from './_index'

export const fetchTestAnswer = async (id) => {
    const { data } = await $authHost.get(`api/testAnswer/${id}`)
    return data
}

export const fetchTestAnswersByTestQuestionId = async (testQuestionId) => {
    const { data } = await $authHost.get(`api/testAnswer/testQuestion/${testQuestionId}`)
    return data
}

export const fetchTestAnswers = async () => {
    const { data } = await $authHost.get('api/testAnswer')
    return data
}

export const createTestAnswer = async (text, isCorrect, testQuestionId) => {
    const { data } = await $authHost.post('api/testAnswer', {
        text,
        isCorrect,
        testQuestionId,
    })
    return data
}

export const updateTestAnswer = async (id, text, isCorrect, testQuestionId) => {
    const { data } = await $authHost.put(`api/testAnswer/${id}`, {
        text,
        isCorrect,
        testQuestionId,
    })
    return data
}

export const deleteTestAnswer = async (id) => {
    const { data } = await $authHost.delete(`api/testAnswer/${id}`)
    return data
}
