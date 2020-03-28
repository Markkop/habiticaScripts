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
