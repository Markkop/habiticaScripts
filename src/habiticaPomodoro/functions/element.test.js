import { getPomodoroTask, clickOnGoodHabit } from './element'
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

describe('clickOnGoodHabit', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })
    it('returns false if no good habit button', () => {
        const hasClicked = clickOnGoodHabit(document.body)
        expect(hasClicked).toBeFalsy()
    })
    it("returns false if there's no click function", () => {
        document.body.innerHTML = pomodoroTaskMock
        const goodHabit = document.querySelector('.task-good-control-inner-habit')
        goodHabit.click = ''

        const hasClicked = clickOnGoodHabit(document.body)
        expect(hasClicked).toBeFalsy()
    })
    it('clicks on the good habit button', () => {
        document.body.innerHTML = pomodoroTaskMock
        const goodHabit = document.querySelector('.task-good-control-inner-habit')
        goodHabit.click = () => {}

        const hasClicked = clickOnGoodHabit(document)
        expect(hasClicked).toBeTruthy()
    })
})
