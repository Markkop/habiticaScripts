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
        workTime: 25 * 60,
        breakTime: 5 * 60,
        noSounds: false,
        playIcon: '🍅',
        stopIcon:
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M18.885 3.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.073.1 4.341 4.341 1.737 12.291-5.491 12.291v4.8c3.708 0 6.614-1.244 8.885-3.515 4.686-4.686 4.686-12.284 0-16.97z"/></svg>',
        playRestingIcon: '💤',
        idleIcon: '⌛️',
    };

    /**
     * @typedef CustomTimes
     * @param { Number } workTime in seconds
     * @param { Number } breakTime in seconds
     */

    /**
     * Get work and break times from a text string, matching
     * both formats: "10min / 5min", "10:00 / 05:00"
     * @param { String } text
     * @returns { CustomTimes }
     */
    const parseNotes = text => {
        const matches = text.match(/\d{1,2}/g);
        if (!matches) {
            return null
        }

        const times = Array.from(matches).map(Number);
        let workTime = 0;
        let breakTime = 0;
        if (times.length === 4) {
            workTime = times[0] + times[1] / 60;
            breakTime = times[2] + times[3] / 60;
        }

        if (times.length === 2) {
            workTime = times[0];
            breakTime = times[1];
        }

        workTime *= 60;
        breakTime *= 60;
        return { workTime, breakTime }
    };

    /**
     * Get custom times from task notes
     * @returns { CustomTimes }
     */
    const getTimesFromTaskNotes = () => {
        const taskNotes = document.querySelector('.pomodoro-task .task-notes') || {};
        const text = taskNotes.innerText || '';
        return parseNotes(text)
    };

    /**
     * Update settings with custom times
     */
    const updateCustomTimes = () => {
        const customTimes = getTimesFromTaskNotes();
        if (customTimes) {
            settings.workTime = customTimes.workTime;
            settings.breakTime = customTimes.breakTime;
        }
    };

    /**
     * Plays a sound
     * Habitica Sounds Names:
     * 'Achievement_Unlocked','Chat','Daily','Death',
     * 'Item_Drop','Level_Up','Minus_Habit','Plus_Habit',
     * 'Reward','Todo'
     * @param { String } sound name
     */
    const playSound = sound => {
        const { noSounds } = settings;
        if (noSounds) {
            return
        }

        let audioPlayer = document.querySelector('#player');
        if (!audioPlayer) {
            audioPlayer = document.createElement('audio');
            audioPlayer.id = 'player';
        }
        audioPlayer.src = `https://habitica.com/static/audio/danielTheBard/${sound}.ogg`;
        audioPlayer.play();
    };

    /**
     * Puts a zero in front of single digits
     * @param { Number } number
     * @returns { String } number with two digits
     */
    const formatOneDigit = number => {
        const numberStringified = String(number);
        const digits = numberStringified.length;
        const hasOneDigit = digits === 1;
        return hasOneDigit ? `0${number}` : numberStringified
    };

    /**
     * Formats task title
     * @param { String } icon
     * @param { Number } time in seconds
     */
    const formatTitle = (icon, time) => {
        let minutes = '';
        let seconds = '';
        if (time < 60) {
            minutes = '00';
            seconds = formatOneDigit(time);
        } else {
            time = time / 60;
            minutes = formatOneDigit(Math.trunc(time));
            seconds = formatOneDigit(Math.round((time - minutes) * 60));
        }
        return `${icon} ${minutes}:${seconds}`
    };

    const { playIcon, playRestingIcon, idleIcon } = settings;
    let seconds = 0;
    let isPaused = true;
    let isResting = false;
    let interval = null;
    let clock = 0;

    const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];

    /**
     * When the left side (Play/Pause) is clicked
     */
    const onLeftControlClick = () => {
        const { breakTime, workTime } = settings;
        const initialTime = isResting ? breakTime : workTime;
        const hasStarted = seconds !== initialTime;
        const hasEnded = seconds <= 0;

        if (!hasStarted || hasEnded) {
            startTimer();
        } else {
            togglePaused();
        }
    };

    /**
     * When the right side (Stop) is clicked
     */
    const onRightControlClick = () => {
        updateCustomTimes();
        isResting = false;
        clock = 0;
        resetTimer();
    };

    /**
     * A high order function to return the function that runs
     * on every interval's tick
     * @returns { Function }
     */
    const tickOneSecond = () => {
        const taskTitle = document.querySelector('.pomodoro-task .task-title');
        const leftIcon = document.querySelector('.timer-icon-left');
        return () => {
            if (isPaused) {
                return
            }
            seconds--;
            const extraText = isResting ? 'Descansando...' : 'Colhendo um pomodoro...';
            const titleIcon = isResting ? playRestingIcon : playIcon;
            taskTitle.innerText = `${formatTitle(titleIcon, seconds)} - ${extraText}`;

            leftIcon.innerHTML = clocks[clock];
            const isLastClock = clock === clocks.length - 1;
            if (isLastClock) {
                clock = 0;
            } else {
                clock++;
            }

            const hasEnded = seconds < 0;
            if (!hasEnded) {
                return
            }

            if (!isResting) {
                playSound('Todo');
                isResting = true;
                resetTimer();
                startTimer();
            } else {
                playSound('Chat');
                isResting = false;
                window.scoreGoodHabit();
                resetTimer();
            }
        }
    };

    /**
     * Start timer
     */
    const startTimer = () => {
        const { breakTime, workTime } = settings;
        const initialTime = isResting ? breakTime : workTime;
        seconds = initialTime;
        isPaused = false;
        tickOneSecond()();
        interval = setInterval(tickOneSecond(), 1000);
    };

    /**
     * Changes between paused and running
     */
    const togglePaused = () => {
        isPaused = !isPaused;
        const currentplayIcon = isResting ? playRestingIcon : playIcon;
        const clockIcon = clocks[clock];

        const leftIcon = document.querySelector('.timer-icon-left');
        leftIcon.innerHTML = isPaused ? currentplayIcon : clockIcon;
    };

    /**
     * Resets timer
     */
    const resetTimer = () => {
        const { breakTime, workTime } = settings;
        isPaused = true;

        const leftIcon = document.querySelector('.timer-icon-left');
        leftIcon.innerHTML = playIcon;

        const taskTitle = document.querySelector('.pomodoro-task .task-title');
        const time = isResting ? breakTime : workTime;
        taskTitle.innerText = formatTitle(idleIcon, time);
        seconds = time;

        clearInterval(interval);
    };

    const { playIcon: playIcon$1, stopIcon, idleIcon: idleIcon$1 } = settings;

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
        task.classList.add('pomodoro-task');
        updateCustomTimes();
        window.scoreGoodHabit = extractClick(task);

        const style =
            'background-color: #50b5e9 !important; cursor: pointer; transition-duration: .15s; transition-property: border-color,background,color; transition - timing - function: ease-in;';

        const leftControl = task.querySelector('.left-control');
        leftControl.innerHTML = `<span class='timer-icon-left' style='font-size: 20px' >${playIcon$1}<span>`;
        leftControl.setAttribute('style', style);
        leftControl.onclick = onLeftControlClick;

        const rightControl = task.querySelector('.right-control');
        rightControl.innerHTML = `<span class='timer-icon-right' style='font-size: 20px' >${stopIcon}<span>`;
        rightControl.setAttribute('style', style);
        rightControl.onclick = onRightControlClick;

        const taskTitle = task.querySelector('.task-title');
        const { workTime } = settings;
        taskTitle.innerText = formatTitle(idleIcon$1, workTime);

        return task
    };

    /**
     * Execute this script
     */
    async function main() {
        try {
            logs('Starting habiticaPomodoro script');
            const pomodoroTask = await waitForExistance(getPomodoroTask);
            convertTask(pomodoroTask);
        } catch (error) {
            logs('Error on habiticaPomodoro.user.js', { error });
        }
    }
    main();

}());
