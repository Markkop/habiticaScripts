import { settings } from '../settings'
import { updateCustomTimes, playSound } from './helper'

const { playIcon, playRestingIcon, idleIcon } = settings
const minuteInSeconds = 60
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
    const hasStarted = seconds !== initialTime * minuteInSeconds
    const hasEnded = seconds <= 0

    if (!hasStarted || hasEnded) {
        startTimer()
    } else {
        togglePaused()
    }
}

/**
 * When the right side (Stop) is clicked
 */
export const onRightControlClick = () => {
    updateCustomTimes()
    isResting = false
    clock = 0
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
        const minutes = Math.floor(seconds / 60)
        const secondsToShow = Math.trunc(seconds % 60)
        const isOneDigit = String(secondsToShow).length === 1
        const zeroDigit = isOneDigit ? '0' : ''
        const extraText = isResting ? 'Descansando...' : 'Colhendo um pomodoro...'
        const titleIcon = isResting ? playRestingIcon : playIcon
        taskTitle.innerText = `${titleIcon} ${minutes}:${zeroDigit}${secondsToShow} - ${extraText}`

        leftIcon.innerHTML = clocks[clock]
        const isLastClock = clock === clocks.length - 1
        if (isLastClock) {
            clock = 0
        } else {
            clock++
        }

        const hasEnded = seconds < 0
        if (hasEnded) {
            if (!isResting) {
                playSound('Todo')
                isResting = true
                resetTimer()
                startTimer()
            } else {
                playSound('Chat')
                isResting = false
                window.scoreGoodHabit()
                resetTimer()
            }
        }
    }
}

/**
 * Start timer
 */
const startTimer = () => {
    const { breakTime, workTime } = settings
    const initialTime = isResting ? breakTime : workTime
    seconds = initialTime * minuteInSeconds
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
    taskTitle.innerText = `${idleIcon} ${time}:00`
    seconds = time * minuteInSeconds

    clearInterval(interval)
}
