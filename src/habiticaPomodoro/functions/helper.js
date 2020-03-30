import { settings } from '../settings'

/**
 * @typedef CustomTimes
 * @param { Number } workTime in seconds
 * @param { Number } breakTime in seconds
 */

/**
 * Get work and break times from a text string, matching
 * both formats: "10min / 5min", "10:00 / 05:00"
 * @param { String } text
 * @returns { CustomTimes }
 */
const parseNotes = text => {
    const matches = text.match(/\d{1,2}/g)
    if (!matches) {
        return null
    }

    const times = Array.from(matches).map(Number)
    let workTime = 0
    let breakTime = 0
    if (times.length === 4) {
        workTime = times[0] + times[1] / 60
        breakTime = times[2] + times[3] / 60
    }

    if (times.length === 2) {
        workTime = times[0]
        breakTime = times[1]
    }

    workTime *= 60
    breakTime *= 60
    return { workTime, breakTime }
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

/**
 * Plays a sound
 * Habitica Sounds Names:
 * 'Achievement_Unlocked','Chat','Daily','Death',
 * 'Item_Drop','Level_Up','Minus_Habit','Plus_Habit',
 * 'Reward','Todo'
 * @param { String } sound name
 */
export const playSound = sound => {
    const { noSounds } = settings
    if (noSounds) {
        return
    }

    let audioPlayer = document.querySelector('#player')
    if (!audioPlayer) {
        audioPlayer = document.createElement('audio')
        audioPlayer.id = 'player'
    }
    audioPlayer.src = `https://habitica.com/static/audio/danielTheBard/${sound}.ogg`
    audioPlayer.play()
}

/**
 * Set task title
 * @param { String } newTitle new title
 * @param { HTMLElement } [titleElement]
 */
export const setTitle = (newTitle, titleElement) => {
    if (!titleElement) {
        titleElement = document.querySelector('.pomodoro-task .task-title')
    }
    taskTitle.innerText = newTitle
}

/**
 * Puts a zero in front of single digits
 * @param { Number } number
 * @returns { String } number with two digits
 */
const formatOneDigit = number => {
    const numberStringified = String(number)
    const digits = numberStringified.length
    const hasOneDigit = digits === 1
    return hasOneDigit ? `0${number}` : numberStringified
}

/**
 * Formats task title
 * @param { String } icon
 * @param { Number } time in seconds
 */
export const formatTitle = (icon, time) => {
    let minutes = ''
    let seconds = ''
    if (time < 60) {
        minutes = '00'
        seconds = formatOneDigit(time)
    } else {
        time = time / 60
        minutes = formatOneDigit(Math.trunc(time))
        seconds = formatOneDigit(Math.round((time - minutes) * 60))
    }
    return `${icon} ${minutes}:${seconds}`
}
