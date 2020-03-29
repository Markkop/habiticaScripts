import { settings } from '../settings'

const { workTime, playSvg, pauseSvg } = settings
const workTimeInSeconds = workTime * 60
let seconds = workTimeInSeconds
let isPaused = true
let interval = null
let clock = 0

const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']

/**
 * When the left side (Play/Pause) is clicked
 */
export const onLeftControlClick = () => {
    const hasStarted = seconds !== workTimeInSeconds
    const hasEnded = seconds <= 0

    if (!hasStarted || hasEnded) {
        startTimer()
    } else {
        togglePaused()
    }
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

        const hasEnded = seconds <= 0
        if (hasEnded) {
            window.scoreGoodHabit()
            resetTimer()
        }
    }
}

/**
 * Start timer
 */
const startTimer = () => {
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
    isPaused = true
    seconds = workTimeInSeconds
    const leftControl = document.querySelector('.pomodoro-task .left-control')
    leftControl.innerHTML = playSvg
    const taskTitle = document.querySelector('.pomodoro-task .task-title')
    taskTitle.innerText = `🕐 ${workTime}:00`
    clearInterval(interval)
}
