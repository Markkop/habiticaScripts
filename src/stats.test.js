// Use this test to develop using mocked data instead of live data

const mockedStats = {
    hp: 37.03646565806994,
    mp: 300.2300000000001,
    exp: 1000.4094671046499,
    gp: 164.177552698031,
    toNextLevel: 1640,
    maxHealth: 50,
    maxMP: 390
}

// Remember to copy/paste this function if changed on user.js file
const settings = {
    max: {
        hp: 'maxHealth',
        mp: 'maxMP',
        exp: 'toNextLevel',
        gp: 'gp'
    }
}

const changeStats = (modifiers, currentStats) => {
    return modifiers.reduce((newStats, modifier) => {
        const { resource, factor, type } = modifier
        const current = currentStats[resource]
        const integer = Number(String(current).split('.')[0])
        const decimal = String(current).split('.')[1]
        const max = currentStats[settings.max[resource]]

        const newValue = {
            flat: integer + factor,
            max: integer + (max/100 * factor),
            current: integer + (current/100 * factor),
            random: integer + Math.floor(Math.random() * (factor - 1)) + 1
        }

        const newStat = Math.round(newValue[type || 'flat'])

        return {
            ...newStats,
            ['stats.'+resource]: Number(newStat + '.' + decimal)
        }
        
    }, {})
}

describe('Stat', () => {
    test('is changed correctly with flat modifiers', () => {
        const spell = {
            modifiers: [
                 { resource: 'hp', factor: -30, type: 'flat'},
                 { resource: 'mp', factor: +10, type: 'flat'},
                 { resource: 'exp', factor: 5, type: 'flat'},
                 { resource: 'gp', factor: +5 }
            ]
        }

        const expectedStats = {
            'stats.hp': 7.03646565806994,
            'stats.mp': 310.2300000000001,
            'stats.exp': 1005.4094671046499,
            'stats.gp': 169.177552698031
        }

        const newStats = changeStats(spell.modifiers, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with max modifiers', () => {
        const spell = {
            modifiers: [
                 { resource: 'hp', factor: -20, type: 'max'},
                 { resource: 'mp', factor: +10, type: 'max'},
                 { resource: 'exp', factor: -50, type: 'max'},
                 { resource: 'gp', factor: +10, type: 'max' }
            ]
        }

        const expectedStats = {
            'stats.hp': 27.03646565806994,
            'stats.mp': 339.2300000000001,
            'stats.exp': 180.4094671046499,
            'stats.gp': 180.177552698031
        }

        const newStats = changeStats(spell.modifiers, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with current modifiers', () => {
        const spell = {
            modifiers: [
                 { resource: 'hp', factor: -20, type: 'current'},
                 { resource: 'mp', factor: +10, type: 'current'},
                 { resource: 'exp', factor: -50, type: 'current'},
                 { resource: 'gp', factor: +5, type: 'current' }
            ]
        }

        const expectedStats = {
            'stats.hp': 30.03646565806994,
            'stats.mp': 330.2300000000001,
            'stats.exp': 500.4094671046499,
            'stats.gp': 172.177552698031
        }

        const newStats = changeStats(spell.modifiers, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with random modifiers', () => {
        const mockMath = Object.create(global.Math);
        mockMath.random = () => 0.5;
        global.Math = mockMath;

        const spell = {
            modifiers: [
                 { resource: 'hp', factor: -10, type: 'random'},
                 { resource: 'mp', factor: +10, type: 'random'},
                 { resource: 'exp', factor: -100, type: 'random'},
                 { resource: 'gp', factor: +50, type: 'random' }
            ]
        }

        const expectedStats = {
            'stats.hp': 32.03646565806994,
            'stats.mp': 305.2300000000001,
            'stats.exp': 950.4094671046499,
            'stats.gp': 189.177552698031
        }

        const newStats = changeStats(spell.modifiers, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('remains equal if modifier value is zero', () => {
        const spell = {
            modifiers: [
                 { resource: 'hp', factor: 0, type: 'flat'},
                 { resource: 'mp', factor: 0, type: 'max'},
                 { resource: 'exp', factor: 0, type: 'current'},
                 { resource: 'gp', factor: 0, type: 'random' }
            ]
        }

        const expectedStats = {
            'stats.hp': 37.03646565806994,
            'stats.mp': 300.2300000000001,
            'stats.exp': 1000.4094671046499,
            'stats.gp': 164.177552698031,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed when only one modifier is provided', () => {
        const spell = {
            modifiers: [
                 {resource: 'hp', factor: +10, type: 'flat'},
            ]
        }

        const expectedStats = {
            'stats.hp': 47.03646565806994,
        }

        const newStats = changeStats(spell.modifiers, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })
})

describe('Checkrequirements', () => {
    window.alert = () => {}

    const checkRequirements = (newStats, currentStats) => {
        const newStatsPairs = Object.entries(newStats);
      
        return newStatsPairs.reduce((result, [key, value]) => {
            const stat = key.split('.')[1]
            const requiredValue = currentStats[stat] + value * -1
            const message = `You need ${requiredValue} ${stat} to cast this skill`
    
            if (value < 0) {
                console.log(message)
                alert(message)
                return false
            }
    
            return result
    
        }, true)
    };

    test("returns false if can't cast a spell", () => {

        const newStats = {
            'stats.hp': 37,
            'stats.mp': -1,
            'stats.exp': 1000,
            'stats.gp': 164,
        }


        const canCastSpell = checkRequirements(newStats ,mockedStats)

        expect(canCastSpell).toBeFalsy()
    })

    test("returns true if can cast a spell", () => {
        window.alert = msg => console.log(msg)

        const newStats = {
            'stats.hp': 37,
            'stats.mp': 100,
            'stats.exp': 1000,
            'stats.gp': 164,
        }


        const canCastSpell = checkRequirements(newStats ,mockedStats)

        expect(canCastSpell).toBeTruthy()
    })
})