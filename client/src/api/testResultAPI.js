import { $authHost } from './_index'

export const fetchTestResult = async (id) => {
    const { data } = await $authHost.get(`api/testResult/${id}`)
    return data
}

export const fetchTestResultsByStudentId = async (studentId) => {
    const { data } = await $authHost.get(`api/testResult/studentId/${studentId}`)
    return data
}

export const fetchTestResultByStudentIdTestId = async (studentId, testId) => {
    const { data } = await $authHost.post(`api/testResult/studentIdTestId/`, { studentId, testId })
    return data
}

export const fetchTestResultsByTestId = async (testId) => {
    const { data } = await $authHost.get(`api/testResult/testId/${testId}`)
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

export const fetchAvarageTestMarkByStudentId = async (studentId) => {
    const { data } = await $authHost.get(`api/testResult/avgMark/${studentId}`)
    return data
}

export const deleteTestResult = async (id) => {
    const { data } = await $authHost.delete(`api/testResult/${id}`)
    return data
}
