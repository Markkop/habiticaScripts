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

    const settings = {
        workTime: 2,
        breakTime: 1,
        playSvg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M4 3.532l14.113 8.468-14.113 8.468v-16.936zm-2-3.532v24l20-12-20-12z"/></svg>',
        stopSvg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z"/></svg>',
        pauseSvg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M18 2v20h-2v-20h2zm-10 0v20h-2v-20h2zm12-2h-6v24h6v-24zm-10 0h-6v24h6v-24z"/></svg>',
    };

    const { workTime, playSvg, pauseSvg } = settings;
    const workTimeInSeconds = workTime * 60;
    let seconds = workTimeInSeconds;
    let isPaused = true;
    let interval = null;
    let clock = 0;

    const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];

    /**
     * When the left side (Play/Pause) is clicked
     */
    const onLeftControlClick = () => {
        const hasStarted = seconds !== workTimeInSeconds;
        const hasEnded = seconds <= 0;

        if (!hasStarted || hasEnded) {
            startTimer();
        } else {
            togglePaused();
        }
    };

    /**
     * A high order function to return the function that runs
     * on every interval's tick
     * @returns { Function }
     */
    const tickOneSecond = () => {
        const taskTitle = document.querySelector('.pomodoro-task .task-title');
        return () => {
            if (isPaused) {
                return
            }
            seconds--;
            const minutes = Math.floor(seconds / 60);
            const secondsToShow = Math.trunc(seconds % 60);
            const isOneDigit = String(secondsToShow).length === 1;
            const zeroDigit = isOneDigit ? '0' : '';

            taskTitle.innerText = `${clocks[clock]} ${minutes}:${zeroDigit}${secondsToShow}`;

            const isLastClock = clock === clocks.length - 1;
            if (isLastClock) {
                clock = 0;
            } else {
                clock++;
            }

            const hasEnded = seconds <= 0;
            if (hasEnded) {
                window.scoreGoodHabit();
                resetTimer();
            }
        }
    };

    /**
     * Start timer
     */
    const startTimer = () => {
        const leftControl = document.querySelector('.pomodoro-task .left-control');
        leftControl.innerHTML = pauseSvg;
        isPaused = false;
        tickOneSecond()();
        interval = setInterval(tickOneSecond(), 1000);
    };

    /**
     * Changes between paused and running
     */
    const togglePaused = () => {
        isPaused = !isPaused;
        const leftControl = document.querySelector('.pomodoro-task .left-control');
        leftControl.innerHTML = isPaused ? playSvg : pauseSvg;
    };

    /**
     * Resets timer
     */
    const resetTimer = () => {
        isPaused = true;
        seconds = workTimeInSeconds;
        const leftControl = document.querySelector('.pomodoro-task .left-control');
        leftControl.innerHTML = playSvg;
        const taskTitle = document.querySelector('.pomodoro-task .task-title');
        taskTitle.innerText = `🕐 ${workTime}:00`;
        clearInterval(interval);
    };

    const { playSvg: playSvg$1, stopSvg, workTime: workTime$1 } = settings;

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
     * @returns { Boolean } true if extract to window is successfull
     */
    function extractClick(pomodoroTask) {
        const plusSign = pomodoroTask.querySelector('.left-control .task-control');

        if (!plusSign) return null

        const click = plusSign.click;
        const isClickFunction = typeof click === 'function';

        if (!isClickFunction) return null

        return () => plusSign.click()
    }

    /**
     * Convert task to timer
     * @param { HTMLElement } task
     * @returns { HTMLElement }
     */
    const convertTask = task => {
        const style =
            'background-color: gray !important; cursor: pointer; transition-duration: .15s; transition-property: border-color,background,color; transition - timing - function: ease-in;';

        const leftControl = task.querySelector('.left-control');
        leftControl.innerHTML = playSvg$1;
        leftControl.setAttribute('style', style);
        leftControl.onclick = onLeftControlClick;

        const rightControl = task.querySelector('.right-control');
        rightControl.innerHTML = stopSvg;
        rightControl.setAttribute('style', style);
        rightControl.onclick = resetTimer;

        const taskTitle = document.querySelector('.pomodoro-task .task-title');
        taskTitle.innerText = `🕐 ${workTime$1}:00`;

        return task
    };

    /**
     * Execute this script
     */
    async function main() {
        try {
            logs('Starting habiticaPomodoro script');
            const pomodoroTask = await waitForExistance(getPomodoroTask);
            pomodoroTask.classList.add('pomodoro-task');
            window.scoreGoodHabit = extractClick(pomodoroTask);
            convertTask(pomodoroTask);
        } catch (error) {
            logs('Error on habiticaPomodoro.user.js', { error });
        }
    }
    main();

}());
