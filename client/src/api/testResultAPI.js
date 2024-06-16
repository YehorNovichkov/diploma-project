import { $authHost } from './_index'

export const fetchTestResult = async (id) => {
    const { data } = await $authHost.get(`api/testResult/${id}`)
    return data
}

export const fetchTestResultByStudentIdTestId = async (studentId, testId) => {
    const { data } = await $authHost.post(`api/testResult/studentIdTestId/`, { studentId, testId })
    return data
}

export const fetchTestResults = async () => {
    const { data } = await $authHost.get('api/testResult')
    return data
}

export const createTestResult = async (studentId, testId) => {
    const { data } = await $authHost.post('api/testResult', {
        studentId,
        testId,
    })
    return data
}

export const completeTestResult = async (id) => {
    const { data } = await $authHost.patch(`api/testResult/${id}`)
    return data
}

export const deleteTestResult = async (id) => {
    const { data } = await $authHost.delete(`api/testResult/${id}`)
    return data
}
