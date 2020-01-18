import { logs, waitForExistance, checkAndSetTokens, getSpellCard } from './functions/utils.js'
import { setDocumentStyle } from './functions/style'
import { style, settings } from './settings'
import { customSkills } from './skills'
import { createSpell } from './functions/element'

/**
 * Execute this script
 */
async function main() {
    try {
        logs('Starting habiticaCustomSkills script', { customSkills })
        settings.tokens = await checkAndSetTokens()
        const spellCard = await waitForExistance(getSpellCard)
        customSkills.forEach(createSpell, spellCard)
        setDocumentStyle(style)
    } catch (error) {
        logs('Error on habiticaCustomSkills.user.js', { error })
    }
}
main()
