import { settings } from '../settings'
import { updateCustomTimes } from './helper'

const { playSvg, pauseSvg } = settings
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
    resetTimer()
}

/**
 * A high order function to return the function that runs
 * on every interval's tick
 * @returns { Function }
 */
const tickOneSecond = () => {
    const taskTitle = document.querySelector('.pomodoro-task .task-title')
    return () => {
        if (isPaused) {
            return
        }
        seconds--
        const minutes = Math.floor(seconds / 60)
        const secondsToShow = Math.trunc(seconds % 60)
        const isOneDigit = String(secondsToShow).length === 1
        const zeroDigit = isOneDigit ? '0' : ''

        taskTitle.innerText = `${clocks[clock]} ${minutes}:${zeroDigit}${secondsToShow}`

        const isLastClock = clock === clocks.length - 1
        if (isLastClock) {
            clock = 0
        } else {
            clock++
        }

        const hasEnded = seconds < 0
        if (hasEnded) {
            if (!isResting) {
                isResting = true
                resetTimer()
                startTimer()
            } else {
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
    const leftControl = document.querySelector('.pomodoro-task .left-control')
    leftControl.innerHTML = pauseSvg
    isPaused = false
    tickOneSecond()()
    interval = setInterval(tickOneSecond(), 1000)
}

/**
 * Changes between paused and running
 */
const togglePaused = () => {
    isPaused = !isPaused
    const leftControl = document.querySelector('.pomodoro-task .left-control')
    leftControl.innerHTML = isPaused ? playSvg : pauseSvg
}

/**
 * Resets timer
 */
export const resetTimer = () => {
    const { breakTime, workTime } = settings
    isPaused = true

    const leftControl = document.querySelector('.pomodoro-task .left-control')
    leftControl.innerHTML = playSvg
    const taskTitle = document.querySelector('.pomodoro-task .task-title')

    const time = isResting ? breakTime : workTime
    taskTitle.innerText = `🕐 ${time}:00`
    seconds = time * minuteInSeconds

    clearInterval(interval)
}
