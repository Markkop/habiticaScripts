import customSkills from './customSkills'

jest.mock('./customSkills', () => ({
    // The line below allows to mock only some functions
    ...(jest.requireActual('./customSkills.js')),
    getStats: jest.fn(() => (
        {
            hp: 50
        }
    )),
    hey: jest.fn(() => "rua")
}))

test('test' , () => {
    console.log(customSkills)
    console.log(customSkills.getMyHp())
})