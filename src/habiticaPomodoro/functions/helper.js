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
