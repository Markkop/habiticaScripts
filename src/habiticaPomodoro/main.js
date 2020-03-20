import { logs, waitForExistance } from '../utils/common'
import { getPomodoroTask, clickOnGoodHabit } from './functions/element'

/**
 * Execute this script
 */
async function main() {
    try {
        logs('Starting habiticaPomodoro script')
        const pomodoroTask = await waitForExistance(getPomodoroTask)
        const hasClicked = clickOnGoodHabit(pomodoroTask)
    } catch (error) {
        logs('Error on habiticaPomodoro.user.js', { error })
    }
}
main()
