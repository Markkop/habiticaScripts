import { settings } from '../settings'

/**
 * @typedef CustomTimes
 * @param { Number } workTime
 * @param { Number } breakTime
 */

/**
 * Get work and break times from a text string
 * @param { String } text
 * @returns { CustomTimes }
 */
const parseNotes = text => {
    text = text.replace(/\:[0-9]*/g, '')
    const [workTime, breakTime] = Array.from(text.match(/\d{1,2}/g) || []).map(Number)
    if (workTime && breakTime) {
        return { workTime, breakTime }
    }
    return null
}

/**
 * Get custom times from task notes
 * @returns { CustomTimes }
 */
const getTimesFromTaskNotes = () => {
    const taskNotes = document.querySelector('.pomodoro-task .task-notes') || {}
    const text = taskNotes.innerText || ''
    return parseNotes(text)
}

/**
 * Update settings with custom times
 */
export const updateCustomTimes = () => {
    const customTimes = getTimesFromTaskNotes()
    if (customTimes) {
        settings.workTime = customTimes.workTime
        settings.breakTime = customTimes.breakTime
    }
}
