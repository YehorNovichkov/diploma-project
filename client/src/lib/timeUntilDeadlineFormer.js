import { differenceInMinutes, isBefore } from 'date-fns'

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
    const totalMinutesDifference = Math.abs(differenceInMinutes(deadlineDate, now))

    const daysDifference = Math.floor(totalMinutesDifference / 1440) // 1440 minutes in a day
    const hoursDifference = Math.floor((totalMinutesDifference % 1440) / 60)
    const minutesDifference = totalMinutesDifference % 60

    const daysText = `${daysDifference} ${pluralizeUkrainian(daysDifference, 'день', 'днів', 'дні')}`
    const hoursText = `${hoursDifference} ${pluralizeUkrainian(hoursDifference, 'година', 'годин', 'години')}`
    const minutesText = `${minutesDifference} ${pluralizeUkrainian(minutesDifference, 'хвилина', 'хвилин', 'хвилини')}`

    if (isOverdue) {
        return `З часу дедлайну ${daysText}, ${hoursText} та ${minutesText}`
    } else {
        return `До дедлайну ${daysText}, ${hoursText} та ${minutesText}`
    }
}
