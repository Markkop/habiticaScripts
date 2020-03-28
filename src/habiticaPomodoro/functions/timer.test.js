import { convertTask } from './timer'
import fs from 'fs'
import path from 'path'
const pomodoroTaskMock = fs.readFileSync(path.resolve(__dirname, '../mocks/pomodoroTask.html'), 'utf8')

describe('convertTask', () => {
    beforeEach(() => {
        document.body.innerHTML = pomodoroTaskMock
    })

    afterEach(() => {
        document.body.innerHTML = ''
    })

    it('returns a task with new symbols', () => {
        const task = document.querySelector('.task')
        const iconBefore = document.querySelector('svg').innerHTML
        const timerTask = convertTask(task)
        expect(timerTask).toBeDefined()
        const iconAfter = timerTask.querySelector('svg').innerHTML
        expect(iconAfter).not.toEqual(iconBefore)
    })
})
