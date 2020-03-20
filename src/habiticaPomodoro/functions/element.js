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
 * @returns { Boolean } true if clicked successfully
 */
export function clickOnGoodHabit(pomodoroTask) {
    const plusSign = pomodoroTask.querySelector('.task-good-control-inner-habit')

    if (!plusSign) return false

    const click = plusSign.click
    const isClickFunction = typeof click === 'function'

    if (!isClickFunction) return false

    plusSign.click()
    return true
}
