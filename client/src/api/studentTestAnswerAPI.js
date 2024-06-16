import { $authHost } from './_index'

export const fetchStudentTestAnswer = async (id) => {
    const { data } = await $authHost.get(`api/studentTestAnswer/${id}`)
    return data
}

export const fetchStudentTestAnswersByResultIdQuestionId = async (resultId, questionId) => {
    const { data } = await $authHost.post(`api/studentTestAnswer/resultIdQuestionId/`, { resultId, questionId })
    return data
}

export const fetchStudentTestAnswers = async () => {
    const { data } = await $authHost.get('api/studentTestAnswer')
    return data
}

export const createStudentTestAnswer = async (resultId, questionId, answerIds = null, manualAnswer = null) => {
    const { data } = await $authHost.post('api/studentTestAnswer', {
        resultId,
        questionId,
        answerIds,
        manualAnswer,
    })
    return data
}

export const updateStudentTestAnswer = async (id, text, isCorrect, studentTestId) => {
    const { data } = await $authHost.put(`api/studentTestAnswer/${id}`, {
        text,
        isCorrect,
        studentTestId,
    })
    return data
}

export const deleteStudentTestAnswer = async (id) => {
    const { data } = await $authHost.delete(`api/studentTestAnswer/${id}`)
    return data
}
