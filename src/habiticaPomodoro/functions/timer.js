import { settings } from '../settings'

const { workTime, playSvg, pauseSvg, stopSvg } = settings
const workTimeInSeconds = workTime * 60
let seconds = workTimeInSeconds
let isPaused = true
let interval = null

/**
 * When the left side (Play/Pause) is clicked
 */
export const onLeftControlClick = () => {
    console.log({ interval }, { seconds }, { isPaused })
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
    const leftControl = document.querySelector('.pomodoro-task .left-control')

    return () => {
        console.log({ interval }, { seconds }, { isPaused })

        if (isPaused) {
            return
        }
        seconds--
        // const seconds = seconds / 100
        const minutes = Math.floor(seconds / 60)
        const secondsToShow = Math.trunc(seconds % 60)
        taskTitle.innerText = `${minutes}:${secondsToShow}`

        if (seconds <= 0) {
            taskTitle.innerText = `${workTime}:00`
            leftControl.innerHTML = playSvg
            clearInterval(interval)
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
const stopTimer = timer => clearInterval(timer)
