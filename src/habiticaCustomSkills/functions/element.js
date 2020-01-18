import { changeStats, checkRequirements } from './stats'
import { getStats, putStats } from './api'
import { settings } from '../settings'
import { logs } from '../../utils/common'

/**
 * @typedef CustomSpell
 * @property { string } name
 * @property { string } imgSrc
 * @property { string } description
 * @property { SpellModifier[] } modifiers
 */

/**
 * @typedef SpellModifier
 * @property { string } resource
 * @property { number } factor
 * @property { 'flat'|'max'|'current'|'random' } [type=flat]
 */


/**
 * Get spell card html element
 * @returns { HTMLDivElement } spell card
 */
export function getSpellCard() {
    return document.querySelector('.spell-container .row div')
}

/**
 * For each custom spell, creates a new spell card
 * and append them to the spell's row container
 * @param { CustomSpell } customSpell
 * @context { HTMLDivElement } spellCard
 */
export function createSpell(spell) {
    const { name, imgSrc, description, modifiers } = spell

    const spellCard = this.cloneNode(true)
    spellCard.classList.add('newSpell')
    const spellRow = this.parentElement
    spellRow.appendChild(spellCard)

    setSpellTitle(spellCard, name)
    setSpellDescription(spellCard, description)
    setSpellIcon(spellCard, imgSrc)
    setSpellCosts(spellCard, modifiers)
    setSpellBehavior(spellCard, spell)
}

/**
 *
 * Select spell's title element and set it's title
 * @param { HTMLDivElement } spell
 * @param { string } name
 */
export function setSpellTitle(spell, name) {
    const title = spell.querySelector('.title')
    title.innerText = name
}

/**
 * Create a hovering spell's description
 * @param { HTMLDivElement } spell
 * @param { string } name
 */
export function setSpellDescription(spell, description) {
    spell.classList.add('mytooltip')
    const descElement = document.createElement('span')
    descElement.innerText = description
    descElement.classList.add('mytooltiptext', 'popover-body', 'popover')
    spell.appendChild(descElement)
}

/**
 * Select spell's img element and set it's icon
 * @param { HTMLDivElement } spell
 * @param { string } imgSrc
 */
export function setSpellIcon(spell, imgSrc) {
    const img = spell.querySelector('.img')
    img.style.backgroundImage = `url('${imgSrc}')`
}

/**
 * Select spell's cost container element, clone and edit costs
 * elements and remove the original cost element.
 * @param { HTMLDivElement } spell
 * @param { SpellModifier } modifier
 */
export function setSpellCosts(spell, modifier) {
    const costContainer = spell.querySelector('.mana')
    modifier.forEach(cloneAndEditCost, costContainer)
    const originalCost = costContainer.querySelector('.mana-text')
    costContainer.removeChild(originalCost)
}

/**
 * Add spell's onclick on click behavior to get, change
 * and update user's stats
 * @param { HTMLDivElement } spell
 * @param { SpellModifier } stats
 */
export function setSpellBehavior(spell, { name, modifiers }) {
    const spellButton = spell.firstElementChild
    spellButton.onclick = async () => {
        const { tokens, defaultStats } = settings
        const hasCredentials = tokens.api && tokens.user

        const currentStats = await getStats()
        const newStats = changeStats(modifiers, currentStats)
        const canCastSpell = checkRequirements(newStats, currentStats)

        if (!canCastSpell) {
            return logs(`Failed to cast ${name}: not enough resources.`, { modifiers }, { currentStats }, { newStats })
        }

        if (!hasCredentials) {
            return logs(`Failed to cast ${name}: no tokens found.`, { tokens }, { defaultStats }, { newStats })
        }

        const response = await putStats(newStats)
        if (!response.success) {
            return logs(`Failed to cast ${name}: request error`, { tokens }, { response })
        }

        logs(`${name} has been cast!`, { newStats })
        return
    }
}

/**
 * Select spell's cost element, clone it for each negative
 * modifier and set its values, icons and colors.
 *
 * @param { SpellModifier } spell
 * @context { HTMLDivElement } costContainer
 */
export function cloneAndEditCost({ resource, factor, type }) {
    const { color, icon, symbol } = settings
    const cost = this.querySelector('.mana-text')
    const newCost = cost.cloneNode(true)
    newCost.style.color = color[resource]

    const [costIcon, costText] = newCost.children
    costIcon.innerHTML = icon[resource]
    costText.innerText = Math.abs(factor) + symbol[type]
    costText.style.color = color[resource]

    if (factor < 0) {
        this.appendChild(newCost)
    } else {
        const details = this.parentElement
        const detailsFirstElement = details.firstChild

        let bonus = details.querySelector('.bonus')
        if (!bonus) {
            bonus = document.createElement('div')
            bonus.classList.add('bonus')
        }

        bonus.appendChild(newCost)
        newCost.style.padding = '0px 5px'
        details.insertBefore(bonus, detailsFirstElement)
    }
}
