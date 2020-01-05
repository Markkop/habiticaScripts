// Use this test to develop using mocked data instead of live data

const mockedStats = {
    hp: 37.03646565806994,
    mp: 300.2300000000001,
    exp: 1000.4094671046499,
    gp: 164.177552698031,
    lvl: 60,
    class: "wizard",
    points: 0,
    str: 0,
    con: 5,
    int: 55,
    per: 0,
    toNextLevel: 1640,
    maxHealth: 50,
    maxMP: 390
}

// Remember to copy/paste this function if changed on user.js file
const changeStats = (changingStats, currentStats) => {
    const maxMap = {
        hp: 'maxHealth',
        mp: 'maxMP',
        exp: 'toNextLevel',
        gp: 'gp'
    }

    const stats = Object.keys(changingStats)

    return stats.reduce((newStats, stat) => {
        const { value, type } = changingStats[stat]
        const current = currentStats[stat]
        const max = currentStats[maxMap[stat]]

        const modifierMap = {
            flat: current + value,
            max: current + (max/100 * value),
            current: current + (current/100 * value),
            random: current + Math.floor(Math.random() * (value - 1)) + 1
        }

        return {
            ...newStats,
            ['stats.'+stat]: Math.round(modifierMap[type || 'flat'])
        }
        
    }, {})
}

describe('Stat', () => {
    test('is changed correctly with flat modifiers', () => {
        const spell = {
            stats: {
                hp: { value: -30, type: 'flat'},
                mp: { value: +10, type: 'flat'},
                exp: { value: 5, type: 'flat'},
                gp: { value: +5 }
            }
        }

        const expectedStats = {
            'stats.hp': 7,
            'stats.mp': 310,
            'stats.exp': 1005,
            'stats.gp': 169
        }

        const newStats = changeStats(spell.stats, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with max modifiers', () => {
        const spell = {
            stats: {
                hp: { value: -20, type: 'max'},
                mp: { value: +10, type: 'max'},
                exp: { value: -50, type: 'max'},
                gp: { value: +10, type: 'max' }
            }
        }

        const expectedStats = {
            'stats.hp': 27,
            'stats.mp': 339,
            'stats.exp': 180,
            'stats.gp': 181
        }

        const newStats = changeStats(spell.stats, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with current modifiers', () => {
        const spell = {
            stats: {
                hp: { value: -20, type: 'current'},
                mp: { value: +10, type: 'current'},
                exp: { value: -50, type: 'current'},
                gp: { value: +5, type: 'current' }
            }
        }

        const expectedStats = {
            'stats.hp': 30,
            'stats.mp': 330,
            'stats.exp': 500,
            'stats.gp': 172
        }

        const newStats = changeStats(spell.stats, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed correctly with random modifiers', () => {
        const mockMath = Object.create(global.Math);
        mockMath.random = () => 0.5;
        global.Math = mockMath;

        const spell = {
            stats: {
                hp: { value: -10, type: 'random'},
                mp: { value: +10, type: 'random'},
                exp: { value: -100, type: 'random'},
                gp: { value: +50, type: 'random' }
            }
        }

        const expectedStats = {
            'stats.hp': 32,
            'stats.mp': 305,
            'stats.exp': 950,
            'stats.gp': 189
        }

        const newStats = changeStats(spell.stats, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('remains equal if modifier value is zero', () => {
        const spell = {
            stats: {
                hp: { value: 0, type: 'flat'},
                mp: { value: 0, type: 'max'},
                exp: { value: 0, type: 'current'},
                gp: { value: 0, type: 'random' }
            }
        }

        const expectedStats = {
            'stats.hp': 37,
            'stats.mp': 300,
            'stats.exp': 1000,
            'stats.gp': 164,
        }

        const newStats = changeStats(spell.stats, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })

    test('is changed when only one modifier is provided', () => {
        const spell = {
            stats: {
                hp: { value: +10, type: 'flat'},
            }
        }

        const expectedStats = {
            'stats.hp': 47,
        }

        const newStats = changeStats(spell.stats, mockedStats)

        expect(newStats).toEqual(expectedStats)
    })
})

describe('Checkrequirements', () => {
    window.alert = () => {}

    const checkRequirements = (newStats, currentStats) => {
        const newStatsKeys = Object.keys(newStats);
      
        return newStatsKeys.reduce((result, statKey) => {
            const stat = statKey.split('.')[1]
            const value = newStats[statKey]
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