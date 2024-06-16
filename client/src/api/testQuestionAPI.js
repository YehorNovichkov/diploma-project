import { $authHost } from './_index'

export const fetchTestQuestion = async (id) => {
    const { data } = await $authHost.get(`api/testQuestion/${id}`)
    return data
}

export const fetchTestQuestionsByTestId = async (testId) => {
    const { data } = await $authHost.get(`api/testQuestion/test/${testId}`)
    return data
}

export const fetchTestQuestionIdsByTestId = async (testId) => {
    const { data } = await $authHost.get(`api/testQuestion/ids/${testId}`)
    return data
}

export const fetchTestQuestions = async () => {
    const { data } = await $authHost.get('api/testQuestion')
    return data
}

export const createTestQuestion = async (text, isManual, testId) => {
    const { data } = await $authHost.post('api/testQuestion', {
        text,
        isManual,
        testId,
    })
    return data
}

export const updateTestQuestion = async (id, text, isManual, testId) => {
    const { data } = await $authHost.put(`api/testQuestion/${id}`, {
        text,
        isManual,
        testId,
    })
    return data
}

export const updateTestQuestionFilesCount = async (id, filesCount) => {
    const { data } = await $authHost.patch(`api/testQuestion/${id}`, { filesCount })
    return data
}

export const deleteTestQuestion = async (id) => {
    const { data } = await $authHost.delete(`api/testQuestion/${id}`)
    return data
}
