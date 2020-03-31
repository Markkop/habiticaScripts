import { settings } from '../settings'
import { updateCustomTimes, playSound, formatTitle } from './helper'

const { playIcon, playRestingIcon, idleIcon } = settings
let seconds = 0
let isPaused = true
let isResting = false
let interval = null
let clock = 0

const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']

/**
 * When the left side (Play/Pause) is clicked
 */
export const onLeftControlClick = () => {
    const { breakTime, workTime } = settings
    const initialTime = isResting ? breakTime : workTime
    const hasStarted = seconds !== initialTime
    const hasEnded = seconds <= 0

    if (!hasStarted || hasEnded) {
        startTimer()
    } else {
        togglePaused()
    }
}

/**
 * Resets page title to Habitica
 */
const resetTitle = () => {
    document.title = 'Habitica'
}

/**
 * When the right side (Reset) is clicked
 */
export const onRightControlClick = () => {
    updateCustomTimes()
    isResting = false
    clock = 0
    resetTitle()
    resetTimer()
}

/**
 * A high order function to return the function that runs
 * on every interval's tick
 * @returns { Function }
 */
const tickOneSecond = () => {
    const taskTitle = document.querySelector('.pomodoro-task .task-title')
    const leftIcon = document.querySelector('.timer-icon-left')
    return () => {
        if (isPaused) {
            return
        }
        seconds--
        const extraText = isResting ? 'Descansando...' : 'Colhendo um pomodoro...'
        const titleIcon = isResting ? playRestingIcon : playIcon
        taskTitle.innerText = `${formatTitle(titleIcon, seconds)} - ${extraText}`
        document.title = formatTitle(titleIcon, seconds)

        leftIcon.innerHTML = clocks[clock]
        const isLastClock = clock === clocks.length - 1
        if (isLastClock) {
            clock = 0
        } else {
            clock++
        }

        const hasEnded = seconds < 0
        if (!hasEnded) {
            return
        }

        if (!isResting) {
            playSound('Todo')
            isResting = true
            resetTimer()
            startTimer()
        } else {
            playSound('Chat')
            isResting = false
            window.scoreGoodHabit()
            resetTitle()
            resetTimer()
        }
    }
}

/**
 * Start timer
 */
const startTimer = () => {
    const { breakTime, workTime } = settings
    const initialTime = isResting ? breakTime : workTime
    seconds = initialTime
    isPaused = false
    tickOneSecond()()
    interval = setInterval(tickOneSecond(), 1000)
}

/**
 * Changes between paused and running
 */
const togglePaused = () => {
    isPaused = !isPaused
    const currentplayIcon = isResting ? playRestingIcon : playIcon
    const clockIcon = clocks[clock]

    const leftIcon = document.querySelector('.timer-icon-left')
    leftIcon.innerHTML = isPaused ? currentplayIcon : clockIcon
}

/**
 * Resets timer
 */
export const resetTimer = () => {
    const { breakTime, workTime } = settings
    isPaused = true

    const leftIcon = document.querySelector('.timer-icon-left')
    leftIcon.innerHTML = playIcon

    const taskTitle = document.querySelector('.pomodoro-task .task-title')
    const time = isResting ? breakTime : workTime
    taskTitle.innerText = formatTitle(idleIcon, time)
    seconds = time

    clearInterval(interval)
}
