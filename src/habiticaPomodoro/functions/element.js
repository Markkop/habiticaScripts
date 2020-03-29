import { settings } from '../settings'
import { onLeftControlClick, resetTimer } from './timer'

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
    const style =
        'background-color: gray !important; cursor: pointer; transition-duration: .15s; transition-property: border-color,background,color; transition - timing - function: ease-in;'

    const leftControl = task.querySelector('.left-control')
    leftControl.innerHTML = playSvg
    leftControl.setAttribute('style', style)
    leftControl.onclick = onLeftControlClick

    const rightControl = task.querySelector('.right-control')
    rightControl.innerHTML = stopSvg
    rightControl.setAttribute('style', style)
    rightControl.onclick = resetTimer

    const taskTitle = document.querySelector('.pomodoro-task .task-title')
    taskTitle.innerText = `🕐 ${workTime}:00`

    return task
}
