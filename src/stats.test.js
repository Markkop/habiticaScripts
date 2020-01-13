// Use this test to develop using mocked data instead of live data

const mockedStats = {
    hp: 37.03646565806994,
    mp: 300.2300000000001,
    exp: 1000.4094671046499,
    gp: 164.177552698031,
    toNextLevel: 1640,
    maxHealth: 50,
    maxMP: 390,
}

// Remember to copy/paste this function if changed on user.js file
const settings = {
    max: {
        hp: 'maxHealth',
        mp: 'maxMP',
        exp: 'toNextLevel',
        gp: 'gp',
    },
}

const changeStats = (modifiers, currentStats) => {
    return modifiers.reduce((newStats, modifier) => {
        const { resource, factor, type } = modifier
        const current = currentStats[resource]
        const integer = Number(String(current).split('.')[0])
        const decimal = String(current).split('.')[1] || ''
        const max = currentStats[settings.max[resource]]

        const newValue = {
            flat: integer + factor,
            max: integer + (max / 100) * factor,
            current: integer + (current / 100) * factor,
            random: integer + Math.floor(Math.random() * (factor - 1)) + 1,
        }
        const newStat = Math.round(newValue[type || 'flat'])

        return {
            ...newStats,
            [resource]: Number(newStat + '.' + decimal),
        }
    }, {})
}

describe('Stat', () => {
    test('is changed correctly with flat modifiers', () => {
        const spell = {
            modifiers: [
                { resource: 'hp', factor: -30, type: 'flat' },
                { resource: 'mp', factor: +10, type: 'flat' },
                { resource: 'exp', factor: 5, type: 'flat' },
                { resource: 'gp', factor: +5 },
            ],
        }

        const expectedStats = {
            hp: 7.03646565806994,
            mp: 310.2300000000001,
            exp: 1005.4094671046499,
            gp: 169.177552698031,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)
        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with max modifiers', () => {
        const spell = {
            modifiers: [
                { resource: 'hp', factor: -20, type: 'max' },
                { resource: 'mp', factor: +10, type: 'max' },
                { resource: 'exp', factor: -50, type: 'max' },
                { resource: 'gp', factor: +10, type: 'max' },
            ],
        }

        const expectedStats = {
            hp: 27.03646565806994,
            mp: 339.2300000000001,
            exp: 180.4094671046499,
            gp: 180.177552698031,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)
        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with current modifiers', () => {
        const spell = {
            modifiers: [
                { resource: 'hp', factor: -20, type: 'current' },
                { resource: 'mp', factor: +10, type: 'current' },
                { resource: 'exp', factor: -50, type: 'current' },
                { resource: 'gp', factor: +5, type: 'current' },
            ],
        }

        const expectedStats = {
            hp: 30.03646565806994,
            mp: 330.2300000000001,
            exp: 500.4094671046499,
            gp: 172.177552698031,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)
        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with random modifiers', () => {
        const mockMath = Object.create(global.Math)
        mockMath.random = () => 0.5
        global.Math = mockMath

        const spell = {
            modifiers: [
                { resource: 'hp', factor: -10, type: 'random' },
                { resource: 'mp', factor: +10, type: 'random' },
                { resource: 'exp', factor: -100, type: 'random' },
                { resource: 'gp', factor: +50, type: 'random' },
            ],
        }

        const expectedStats = {
            hp: 32.03646565806994,
            mp: 305.2300000000001,
            exp: 950.4094671046499,
            gp: 189.177552698031,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)
        expect(newStats).toEqual(expectedStats)
    })

    test('remains equal if modifier value is zero', () => {
        const spell = {
            modifiers: [
                { resource: 'hp', factor: 0, type: 'flat' },
                { resource: 'mp', factor: 0, type: 'max' },
                { resource: 'exp', factor: 0, type: 'current' },
                { resource: 'gp', factor: 0, type: 'random' },
            ],
        }

        const expectedStats = {
            hp: 37.03646565806994,
            mp: 300.2300000000001,
            exp: 1000.4094671046499,
            gp: 164.177552698031,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)
        expect(newStats).toEqual(expectedStats)
    })

    test('is changed when only one modifier is provided', () => {
        const spell = {
            modifiers: [{ resource: 'hp', factor: +10, type: 'flat' }],
        }

        const expectedStats = {
            hp: 47.03646565806994,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)
        expect(newStats).toEqual(expectedStats)
    })
})

describe('Checkrequirements', () => {
    const logs = () => {}

    const checkRequirements = (newStats, currentStats) => {
        const newStatsPairs = Object.entries(newStats)
        return newStatsPairs.reduce((result, [key, value]) => {
            const requiredValue = currentStats[key] + value * -1

            if (value < 0) {
                logs(`You need ${requiredValue} ${key} to cast this skill`, { newStats }, { currentStats })
                return false
            }

            return result
        }, true)
    }

    test("returns false if can't cast a spell", () => {
        const newStats = {
            hp: 37,
            mp: -1,
            exp: 1000,
            gp: 164,
        }

        const canCastSpell = checkRequirements(newStats, mockedStats)
        expect(canCastSpell).toBeFalsy()
    })

    test('returns true if can cast a spell', () => {
        const newStats = {
            hp: 37,
            mp: 100,
            exp: 1000,
            gp: 164,
        }

        const canCastSpell = checkRequirements(newStats, mockedStats)
        expect(canCastSpell).toBeTruthy()
    })
})
