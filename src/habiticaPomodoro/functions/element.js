import { settings } from '../settings'
import { onLeftControlClick } from './timer'

const { playSvg, stopSvg, workTime } = settings

/**
 * Get task with title #pomodoro
 * @returns { HTMLDivElement } habit task
 */
export function getPomodoroTask() {
    const habitTasks = Array.from(document.querySelectorAll('.task.type_habit'))
    const pomodoroTask = habitTasks.find(task => {
        const title = task.querySelector('p')
        const text = title.innerHTML
        const hasPomodoroTitle = text === '#pomodoro'
        return hasPomodoroTitle
    })
    return pomodoroTask
}

/**
 * Clicks and counts the given Pomodoro Task as a good habit
 * @returns { Boolean } true if extract to window is successfull
 */
export function extractClick(pomodoroTask) {
    const plusSign = pomodoroTask.querySelector('.left-control .task-control')

    if (!plusSign) return null

    const click = plusSign.click
    const isClickFunction = typeof click === 'function'

    if (!isClickFunction) return null

    return () => plusSign.click()
}

/**
 * Convert task to timer
 * @param { HTMLElement } task
 * @returns { HTMLElement }
 */
export const convertTask = task => {
    const leftControl = task.querySelector('.left-control')
    leftControl.innerHTML = playSvg
    const svgMinusDiv = task.querySelector('.right-control')
    svgMinusDiv.innerHTML = stopSvg

    const taskTitle = document.querySelector('.pomodoro-task .task-title')
    taskTitle.innerText = `${workTime}:00`

    const left = task.querySelector('.left-control')
    left.onclick = onLeftControlClick

    return task
}
