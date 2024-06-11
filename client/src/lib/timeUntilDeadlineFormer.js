import { differenceInDays, differenceInHours, isBefore } from 'date-fns'

const pluralizeUkrainian = (number, singular, plural, few) => {
    if (number % 10 === 1 && number % 100 !== 11) {
        return singular
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return few
    } else {
        return plural
    }
}

export const getTimeUntilDeadline = (deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)

    const isOverdue = isBefore(deadlineDate, now)
    const hoursDifference = Math.abs(differenceInHours(deadlineDate, now))
    const daysDifference = Math.abs(differenceInDays(deadlineDate, now))

    if (isOverdue) {
        if (hoursDifference < 24) {
            return `${hoursDifference} ${pluralizeUkrainian(hoursDifference, 'година', 'годин', 'години')} тому`
        } else {
            return `${daysDifference} ${pluralizeUkrainian(daysDifference, 'день', 'днів', 'дні')} тому`
        }
    } else {
        if (hoursDifference < 24) {
            return `${hoursDifference} ${pluralizeUkrainian(hoursDifference, 'година залишилась', 'годин залишилось', 'години залишилось')}`
        } else {
            return `${daysDifference} ${pluralizeUkrainian(daysDifference, 'день залишився', 'днів залишилось', 'дні залишилось')}`
        }
    }
}
