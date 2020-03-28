// ==UserScript==
// @name        habiticaPomodoro
// @version     1.0.0
// @description Creates a timer on a pomodoro task
// @include     http*://habitica.com*
// @run-at 	    document-idle
// @author      Marcelo 'Mark' Kopmann
// ==/UserScript==

;(function() {
    'use strict'

    /**
     * Logs a message and objects passed as arguments
     */
    function logs() {
        const [message, ...details] = [...arguments]
        const warning = details.reduce((parsedObject, object) => ({ ...parsedObject, ...object }), {})
        console.warn({ message, ...warning })
    }

    /**
     * Wait for the existance of a value
     * @param { function } getValueFunction function that returns the value
     * @param { number } time wait time before trying again
     * @param { number } maxTries max tries before stop waiting
     * @returns { Promise }
     */
    function waitForExistance(getValueFunction, time = 200, maxTries = 10) {
        return new Promise((resolve, reject) => {
            let tries = 0
            let interval = setInterval(() => {
                const value = getValueFunction()
                if (!value) {
                    tries += 1
                    return
                }

                if (tries >= maxTries) {
                    logs(`No value was found after ${tries} tries`, { getValueFunction })
                    clearInterval(interval)
                    return reject(null)
                }

                clearInterval(interval)
                return resolve(value)
            }, time)
        })
    }

    /**
     * Get task with title #pomodoro
     * @returns { HTMLDivElement } habit task
     */
    function getPomodoroTask() {
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
    function saveClickOnGoodHabit(pomodoroTask) {
        const plusSign = pomodoroTask.querySelector('.left-control .task-control')

        if (!plusSign) return false

        const click = plusSign.click
        const isClickFunction = typeof click === 'function'

        if (!isClickFunction) return false

        window.clickPlus = () => plusSign.click()
        return true
    }

    const playSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M4 3.532l14.113 8.468-14.113 8.468v-16.936zm-2-3.532v24l20-12-20-12z"/></svg>'
    const stopSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z"/></svg>'

    const convertTask = task => {
        const leftControl = task.querySelector('.left-control')
        leftControl.innerHTML = playSvg
        const svgMinusDiv = task.querySelector('.right-control')
        svgMinusDiv.innerHTML = stopSvg

        const left = task.querySelector('.left-control')
        left.onclick = () => console.log('a')

        return task
    }

    /**
     * Execute this script
     */
    async function main() {
        try {
            logs('Starting habiticaPomodoro script')
            const pomodoroTask = await waitForExistance(getPomodoroTask)
            saveClickOnGoodHabit(pomodoroTask)
            convertTask(pomodoroTask)
        } catch (error) {
            logs('Error on habiticaPomodoro.user.js', { error })
        }
    }
    main()
})()
