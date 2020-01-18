import { settings } from '../settings'
import { logs } from '../../utils/common'


/**
 * @typedef ValidStats
 * @property { number } [stats.hp]
 * @property { number } [stats.mp]
 * @property { number } [stats.exp]
 * @property { number } [stats.gp]
 */


/**
 * Validate and return stats
 * @param { ValidStats } stats
 * @param { String } resource
 * @param { String } amount
 * @returns { ValidStats }
 */
export function validateStats(stats, [resource, amount]) {
    const { defaultStats } = settings
    const isNumber = typeof amount === 'number'
    const defaults = defaultStats[resource]
    return {
        ...stats,
        ['stats.' + resource]: isNumber ? amount : defaults,
    }
}

/**
 * Change receieved Habitica's stats using spell stats
 * IMPORTANT: develop this function using test file, since
 * wrong returned values can cause your character's death
 *
 * @param { SpellModifier[] } modifiers
 * @param { HabiticaStats } currentStats
 * @returns { ChangedStats }
 */
export function changeStats(modifiers, currentStats) {
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

/**
 * Check if changed stats are valid (ie. enough resources)
 * IMPORTANT: develop this function using test file
 *
 * @param { ChangedStats } newStats
 * @param { HabiticaStats } currentStats
 * @returns { Boolean } True for valid stats
 */
export function checkRequirements(newStats, currentStats) {
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

export default { checkRequirements, changeStats }
