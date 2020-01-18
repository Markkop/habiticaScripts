import { logs, clickOnSelector } from '../../utils/common'
import { settings } from '../settings'
import { validateStats } from './stats'

/**
 * @typedef HabiticaStats
 * @property { Number } hp 
 * @property { Number } mp 
 * @property { Number } exp 
 * @property { Number } gp 
 * @property { Number } toNextLevel 
 * @property { Number } maxHealth 
 * @property { Number } maxMP 
/**


/**
 * @typedef ChangedStats
 * @property { number } [hp]
 * @property { number } [mp]
 * @property { number } [exp]
 * @property { number } [gp]
 */


/**
 * Get user's stats (hp, mp, ...) from Habitica's endpoint
 * using the user's token set in the top of this file
 * @returns { HabiticaStats }
 */
export async function getStats() {
    try {
        const { tokens, defaultStats } = settings
        if (!tokens.user) {
            return defaultStats
        }

        const resp = await fetch(`https://habitica.com/api/v3/members/${tokens.user}`)
        const respJson = await resp.json()

        if (!respJson.success) {
            logs('Request to Habitica failed, using default stats..', { respJson })
            return defaultStats
        }

        const stats = respJson.data && respJson.data.stats
        return stats
    } catch (err) {
        logs('Error while trying to get user stats', { err })
    }
}

/**
 * Update Habitica's character stats
 * @param { ChangedStats } newStats
 */
export async function putStats(newStats) {
    try {
        const statsEntries = Object.entries(newStats)
        const { tokens } = settings
        const validStats = statsEntries.reduce(validateStats, {})

        const response = await fetch('https://habitica.com/api/v3/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-user': `${tokens.user}`,
                'x-api-key': `${tokens.api}`,
                'x-client': `${tokens.user}-Testing`,
            },
            body: JSON.stringify(validStats),
        })

        const respJson = await response.json()

        clickOnSelector('[role=link]')
        return respJson
    } catch (error) {
        logs('Error while updating user stats', { error })
        return false
    }
}
