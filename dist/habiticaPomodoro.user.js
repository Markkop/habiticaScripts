// ==UserScript== 
// @name        habiticaPomodoro 
// @version     1.0.0 
// @description Creates a timer on a pomodoro task 
// @include     http*://habitica.com* 
// @run-at 	    document-idle 
// @author      Marcelo 'Mark' Kopmann 
// ==/UserScript== 

(function () {
    'use strict';

    /**
     * Logs a message and objects passed as arguments
     */
    function logs() {
        const [message, ...details] = [...arguments];
        const warning = details.reduce((parsedObject, object) => ({ ...parsedObject, ...object }), {});
        console.warn({ message, ...warning });
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
            let tries = 0;
            let interval = setInterval(() => {
                const value = getValueFunction();
                if (!value) {
                    tries += 1;
                    return
                }

                if (tries >= maxTries) {
                    logs(`No value was found after ${tries} tries`, { getValueFunction });
                    clearInterval(interval);
                    return reject(null)
                }

                clearInterval(interval);
                return resolve(value)
            }, time);
        })
    }

    // import { changeStats, checkRequirements } from './stats'
    // import { getStats, putStats } from './api'
    // import { settings } from '../settings'
    // import { logs } from '../../utils/common'

    /**
     * Get task with title #pomodoro
     * @returns { HTMLDivElement } habit task
     */
    function getPomodoroTask() {
        const habitTasks = Array.from(document.querySelectorAll('.task.type_habit'));
        const pomodoroTask = habitTasks.find(task => {
            const title = task.querySelector('p');
            const text = title.innerHTML;
            const hasPomodoroTitle = text === '#pomodoro';
            return hasPomodoroTitle
        });
        return pomodoroTask
    }

    /**
     * Clicks and counts the given Pomodoro Task as a good habit
     * @returns { Boolean } true if clicked successfully
     */
    function clickOnGoodHabit(pomodoroTask) {
        const plusSign = pomodoroTask.querySelector('.task-good-control-inner-habit');

        if (!plusSign) return false

        const click = plusSign.click;
        const isClickFunction = typeof click === 'function';

        if (!isClickFunction) return false

        plusSign.click();
        return true
    }

    /**
     * Execute this script
     */
    async function main() {
        try {
            logs('Starting habiticaPomodoro script');
            const pomodoroTask = await waitForExistance(getPomodoroTask);
            const hasClicked = clickOnGoodHabit(pomodoroTask);
        } catch (error) {
            logs('Error on habiticaPomodoro.user.js', { error });
        }
    }
    main();

}());
