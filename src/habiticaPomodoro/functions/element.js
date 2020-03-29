import { settings } from '../settings'
import { onLeftControlClick, onRightControlClick } from './timer'
import { updateCustomTimes } from './helper'

const { playIcon, stopIcon, idleIcon } = settings

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
    task.classList.add('pomodoro-task')
    updateCustomTimes()
    window.scoreGoodHabit = extractClick(task)

    const style =
        'background-color: #50b5e9 !important; cursor: pointer; transition-duration: .15s; transition-property: border-color,background,color; transition - timing - function: ease-in;'

    const leftControl = task.querySelector('.left-control')
    leftControl.innerHTML = `<span class='timer-icon-left' style='font-size: 20px' >${playIcon}<span>`
    leftControl.setAttribute('style', style)
    leftControl.onclick = onLeftControlClick

    const rightControl = task.querySelector('.right-control')
    rightControl.innerHTML = `<span class='timer-icon-right' style='font-size: 20px' >${stopIcon}<span>`
    rightControl.setAttribute('style', style)
    rightControl.onclick = onRightControlClick

    const taskTitle = task.querySelector('.task-title')
    const { workTime } = settings
    taskTitle.innerText = `${idleIcon} ${workTime}:00`

    return task
}
