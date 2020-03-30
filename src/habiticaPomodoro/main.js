import { logs, waitForExistance } from '../utils/common'
import { getPomodoroTask, convertTask } from './functions/element'

/**
 * Execute this script
 */
async function main() {
    try {
        logs('Starting habiticaPomodoro script')
        const pomodoroTask = await waitForExistance(getPomodoroTask)
        convertTask(pomodoroTask)
    } catch (error) {
        logs('Error on habiticaPomodoro.user.js', { error })
    }
}
main()
