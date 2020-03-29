import { logs, waitForExistance } from '../utils/common'
import { getPomodoroTask, convertTask } from './functions/element'
import { updateCustomTimes } from './functions/helper'

/**
 * Execute this script
 */
async function main() {
    try {
        logs('Starting habiticaPomodoro script')
        const pomodoroTask = await waitForExistance(getPomodoroTask)
        pomodoroTask.classList.add('pomodoro-task')
        updateCustomTimes()
        convertTask(pomodoroTask)
    } catch (error) {
        logs('Error on habiticaPomodoro.user.js', { error })
    }
}
main()
