import { getPomodoroTask, extractClick } from './element'
import fs from 'fs'
import path from 'path'
const tasksHtmlMock = fs.readFileSync(path.resolve(__dirname, '../mocks/tasks.html'), 'utf8')
const pomodoroTaskMock = fs.readFileSync(path.resolve(__dirname, '../mocks/pomodoroTask.html'), 'utf8')

describe('getPomodoroTask', () => {
    beforeEach(() => {
        document.body.innerHTML = tasksHtmlMock
    })

    afterEach(() => {
        document.body.innerHTML = ''
    })

    it("doesn't return undefined", () => {
        const pomodoroTask = getPomodoroTask()
        expect(pomodoroTask).toBeDefined()
    })
    it('returns an HTML element with habit task class names', () => {
        const pomodoroTask = getPomodoroTask()
        const classes = Array.from(pomodoroTask.classList)
        const expectedClassNames = ['task', 'type_habit']
        expectedClassNames.forEach(className => expect(classes).toContain(className))
    })
})

describe('extractClick', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })
    it("returns null if there's no task-control element", () => {
        const click = extractClick(document.body)
        expect(click).toBeFalsy()
    })
    it('returns null if click is not a function', () => {
        document.body.innerHTML = pomodoroTaskMock
        const goodHabit = document.querySelector('.task-good-control-inner-habit')
        goodHabit.click = ''

        const click = extractClick(document.body)
        expect(click).toBeFalsy()
    })
    it('returns a function', () => {
        document.body.innerHTML = pomodoroTaskMock
        const goodHabit = document.querySelector('.task-good-control-inner-habit')
        goodHabit.click = () => {}

        const click = extractClick(document)
        expect(typeof click).toBe('function')
    })
})
