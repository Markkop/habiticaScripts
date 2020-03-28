import { logs, waitForExistance } from '../utils/common'
import { getPomodoroTask, extractClick } from './functions/element'
import { convertTask } from './functions/timer'

/**
 * Execute this script
 */
async function main() {
    try {
        logs('Starting habiticaPomodoro script')
        const pomodoroTask = await waitForExistance(getPomodoroTask)
        window.clickPlus = extractClick(pomodoroTask)
        convertTask(pomodoroTask)
    } catch (error) {
        logs('Error on habiticaPomodoro.user.js', { error })
    }
}
main()
