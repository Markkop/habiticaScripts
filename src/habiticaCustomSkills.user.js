// ==UserScript==
// @name        habiticaCustomSkills
// @version     2.0.1
// @description Create new habitica skills to modify user stats
// @grant       none
// @include     http*://habitica.com*
// @run-at 	    document-idle
// ==/UserScript==

// To do: first cast is taking decimal stat values into account; make it ignore them

/************
 ** SKILLS **
 ************/

const customSkills = [
    {
        name: 'Soul Pact',
        imgSrc:
            'https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png',
        description:
            'Sacrifices health and experience to recover 10% of your max mana',
        modifiers: [
            { resource: 'hp', factor: -20, type: 'max'},
            { resource: 'mp', factor: +10, type: 'max'},
            { resource: 'exp', factor: -40, type: 'max'},
        ],
    },
    {
        name: 'Midas Touch',
        imgSrc: 
            'http://pixeljoint.com/files/icons/goldbar.png',
        description: 
            'Transmutes 10 gold coins by consuming mana and experience',
        modifiers: [
            { resource: 'mp', factor: -25, type: 'max'},
            { resource: 'exp', factor: -20, type: 'max'},
            { resource: 'gp', factor: +10, type: 'flat' }
        ]
    },
    {
        name: 'Time Rewind',
        imgSrc:
            'https://www.pngix.com/pngfile/middle/185-1857051_stopwatch-comments-delay-clipart-transparent-hd-png-download.png',
        description:
            'Sends you back in time some moments ago consuming all your current experience and restoring 10% of your max health',
        modifiers: [
            { resource: 'hp', factor: +10, type: 'max'},
            { resource: 'mp', factor: -70, type: 'max'},
            { resource: 'exp', factor: -100, type: 'current'},
        ]
    },
    {
        name: 'Find Gold',
        imgSrc: 
            'http://pixeljoint.com/files/icons/mh_coinzpreview.png',
        description: 
            'Casts a power word that finds a random quantity of coins',
        modifiers: [
            { resource: 'mp', factor: -5, type: 'max'},
            { resource: 'gp', factor: +10, type: 'random' }
        ],
    },
];

/**************
 ** SETTINGS **
 **************/

const settings = {
    tokens: {
        // Replace with yours: https://habitica.com/user/settings/api
        user: '',
        api: '',
    },
    icon: {
        hp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#F74E52" d="M2 4.5L6.167 2 12 5.167 17.833 2 22 4.5V12l-4.167 5.833L12 22l-5.833-4.167L2 12z"></path><path fill="#FF6165" d="M7.333 16.667L3.667 11.5V5.417l2.5-1.5L12 7.083l5.833-3.166 2.5 1.5V11.5l-3.666 5.167L12 19.917z"></path><path fill="#FFF" d="M12 14.083l4.667 2.584L12 19.917z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l-4.667 2.584L12 19.917z" opacity=".35"></path><path fill="#FFF" d="M7.333 16.667L3.667 11.5 12 14.083z" opacity=".25"></path><path fill="#B52428" d="M16.667 16.667l3.666-5.167L12 14.083z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l5.833-10.166 2.5 1.5V11.5z" opacity=".35"></path><path fill="#B52428" d="M12 14.083L6.167 3.917l-2.5 1.5V11.5z" opacity=".5"></path><path fill="#FFF" d="M12 14.083L6.167 3.917 12 7.083z" opacity=".5"></path><path fill="#FFF" d="M12 14.083l5.833-10.166L12 7.083z" opacity=".25"></path><path fill="#FFF" d="M9.167 14.833l-3-4.166V6.833h.083L12 9.917l5.75-3.084h.083v3.834l-3 4.166L12 16.917z" opacity=".5"></path></g></svg></div>',
        mp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#2995CD" d="M22 15l-10 9-10-9L12 0z"></path><path fill="#50B5E9" d="M4.6 14.7l7.4-3v9.6z"></path><path fill="#1F709A" d="M12 11.7l7.4 3-7.4 6.6z" opacity=".25"></path><path fill="#FFF" d="M12 11.7V3.6l7.4 11.1z" opacity=".25"></path><path fill="#FFF" d="M4.6 14.7L12 3.6v8.1z" opacity=".5"></path><path fill="#FFF" d="M7.2 14.3L12 7.2l4.8 7.1-4.8 4.3z" opacity=".5"></path></g></svg></div>',
        exp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#FFA623" d="M16 16l8-4-8-4-4-8-4 8-8 4 8 4 4 8z"></path><path fill="#FFF" d="M4.5 12l5-2.5L12 12zm7.5 7.5l-2.5-5L12 12zm7.5-7.5l-5 2.5L12 12zM12 4.5l2.5 5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M19.5 12l-5-2.5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M12 19.5l2.5-5L12 12z" opacity=".5"></path><path fill="#FFF" d="M4.5 12l5 2.5L12 12zM12 4.5l-2.5 5L12 12z" opacity=".5"></path><path fill="#FFF" d="M10.8 13.2L8.5 12l2.3-1.2L12 8.5l1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3z" opacity=".5"></path></g></svg></div>',
        gp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle cx="12" cy="12" r="12" fill="#FFA623"></circle><path fill="#FFF" d="M6.3 17.7c-3.1-3.1-3.1-8.2 0-11.3 3.1-3.1 8.2-3.1 11.3 0" opacity=".5"></path><path fill="#FFF" d="M17.7 6.3c3.1 3.1 3.1 8.2 0 11.3-3.1 3.1-8.2 3.1-11.3 0" opacity=".25"></path><path fill="#BF7D1A" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity=".5"></path><path fill="#BF7D1A" d="M13 9v2h-2V9H9v6h2v-2h2v2h2V9z" opacity=".75"></path></g></svg></div>'
    },
    color: {
        hp: '#F74E52',
        mp: '#2995cd',
        exp: '#BF7300',
        gp: '#BF7300'
    },
    symbol: {
        flat: '',
        max: '%',
        current: '%',
        random: '?'
    },
    max: {
        hp: 'maxHealth',
        mp: 'maxMP',
        exp: 'toNextLevel',
        gp: 'gp'
    },
    defaultStats: {
        hp: 10, 
        mp: 50, 
        exp: 1000, 
        gp: 100, 
        toNextLevel: 1000, 
        maxHealth: 50, 
        maxMP: 100, 
    }
} 

const style = `
.newSpell .img {
    background-repeat: no-repeat,
    background-position: center,
    background-size: 30px 30px
}

.newSpell .mana-text {
    padding-top: 0 !important
}

.newSpell .mana {
    display: flex,
    flex-flow: column,
    align-items: center,
    justify-content: center
}
`

/**********************
 ** TYPE DEFINITIONS **
 **********************/

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
 * @typedef ChangedStats
 * @property { number } [stats.hp]
 * @property { number } [stats.mp]
 * @property { number } [stats.exp]
 * @property { number } [stats.gp]
 */

/**********
 ** MAIN **
 **********/

/**
 * Execute this script
 */
function main() {
    try {
        logs('Starting habiticaCustomSkills script', {customSkills})
        setDocumentStyle(style)
        const spellCard = document.querySelector('.spell-container .row div')
        customSkills.forEach(createSpell, spellCard)
    } catch (error) {
        logs('Error on habiticaCustomSkills.user.js', {error})
    }
}

// Execute this script after 3 sec
// To do: find a better way to check if the page has completely loaded
setTimeout(main, 3000)

/**
 * For each custom spell, creates a new spell card
 * and append them to the spell's row container
 * @param { CustomSpell } customSpell 
 */
function createSpell(spell) {
    const { name, imgSrc, description, modifiers, } = spell
    const spellCard = this.cloneNode(true)
    spellCard.classList.add('newSpell')
    setSpellTitle(spellCard, name)
    // To do: setSpellDescription
    setSpellIcon(spellCard, imgSrc)
    setSpellCosts(spellCard, modifiers)
    setSpellBehavior(spellCard, spell)
    
    const spellRow = this.parentElement
    spellRow.appendChild(spellCard)
}

/***************
 ** API CALLS **
 ***************/

/**
 * Get user's stats (hp, mp, ...) from Habitica's endpoint
 * using the user's token set in the top of this file
 * @returns { HabiticaStats }
 */
const getStats = async () => {
    try {
        const { tokens, defaultStats } = settings
        if(!tokens.user) {
            return defaultStats
        }

        const resp = await fetch(`https://habitica.com/api/v3/members/${tokens.user}`);
        const respJson = await resp.json();
        
        if (!respJson.success) {
            logs('Request to Habitica failed, using default stats..', {respJson})
            return defaultStats
        }

        const stats = respJson.data && respJson.data.stats;
        return stats;
    } catch (err) {
        logs('Error while trying to get user stats', {err});
    }
};

/**
 * Update Habitica's character stats
 * @param { ChangedStats } newStats 
 */
const putStats = async newStats => {
    try {
        const statsEntries = Object.entries(newStats)
        const validStats = statsEntries.reduce(validateStats, {}) 
    
        const response = await fetch('https://habitica.com/api/v3/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-user': `${settings.tokens.user}`,
            'x-api-key': `${settings.tokens.api}`,
            'x-client': `${settings.tokens.user}-Testing`,
          },
          body: JSON.stringify(validStats),
        });

        const respJson = await response.json()
    
        document.querySelector('[role=link]').click()
        return respJson
    } catch (error) {
        logs('Error while updating user stats', {error})
        return false
    }
};

/***********
 ** STATS **
 ***********/

 /**
  * Validate and return stats
  * @param {*} stats 
  * @param {*} param1 
  */
function validateStats(stats, [ key, value ]) {
    const isNumber = typeof value === 'number'
    return {
        ...stats,
        ['stats.'+key]: isNumber ? value : settings.default[key]
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
const changeStats = (modifiers, currentStats) => {
    return modifiers.reduce((newStats, modifier) => {
        const { resource, factor, type } = modifier
        const current = currentStats[resource]
        const integer = Number(String(current).split('.')[0])
        const decimal = String(current).split('.')[1] || ''
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
            [resource]: Number(newStat + '.' + decimal)
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
const checkRequirements = (newStats, currentStats) => {
    const newStatsPairs = Object.entries(newStats);
    return newStatsPairs.reduce((result, [key, value]) => {
        const stat = key.split('.')[1]
        const requiredValue = currentStats[stat] + value * -1

        if (value < 0) {
            logs(`You need ${requiredValue} ${stat} to cast this skill`, {newStats}, {currentStats})
            return false
        }

        return result

    }, true)
};

/**********
 ** HTML **
 **********/

/**
 * Select spell's title element and set it's title
 * @param { HTMLDivElement } spell 
 * @param { string } name 
 */
function setSpellTitle(spell, name) {
    const title = spell.querySelector('.title')
    title.innerText = name
}

/**
 * Select spell's img element and set it's icon
 * @param { HTMLDivElement } spell 
 * @param { string } imgSrc 
 */
function setSpellIcon(spell, imgSrc) {
    const img =  spell.querySelector('.img')
    img.style.backgroundImage = `url('${imgSrc}')`
}

/**
 * Select spell's cost container element, clone and edit costs
 * elements and remove the original cost element.
 * @param { HTMLDivElement } spell 
 * @param { SpellModifier } modifier 
 */
function setSpellCosts(spell, modifier) {
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
function setSpellBehavior (spell, { name, modifiers}) {
    const spellButton = spell.firstElementChild
    spellButton.onclick = async () => {
        const { tokens, defaultStats } = settings
        const hasCredentials = tokens.api && tokens.user

        const currentStats = await getStats()
        const newStats = changeStats(modifiers, currentStats)
        const canCastSpell = checkRequirements(newStats, currentStats)
        
        if (!canCastSpell) {
            return logs(`Failed to cast ${name}: not enough resources.`,
                {modifiers},  {currentStats}, {newStats})
        }
        
        
        if(!hasCredentials) {
            return logs(`Failed to cast ${name}: no tokens found.`, 
                {tokens}, {defaultStats}, {newStats})
        }

        const response = await putStats(newStats)
        if (!response.success) {
            return logs(`Failed to cast ${name}: request error`, {tokens}, {response})
        }

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
function cloneAndEditCost({ resource, factor, type }) {
    if (factor >= 0) {
        return
    }

    const cost = this.querySelector('.mana-text')
    const newCost = cost.cloneNode(true)
    newCost.style.color = settings.color[resource]
    
    const [ costIcon, costText ] = newCost.children
    costIcon.innerHTML = settings.icon[resource]
    costText.innerText = factor + settings.symbol[type]
    costText.style.color = settings.color[resource]
    
    this.appendChild(newCost)
}

/***********
 ** STYLE **
 ***********/

/**
 * Add css styles to the document
 * @param { String } styleSheet 
 */
function setDocumentStyle(styleSheet) {
    const lines = styleSheet.replace(/\,/g, '').match(/(.+)+/g)
    const rules = lines.reduce(parseStyleSheet, [])
    
    const style = document.createElement('style');
    document.head.appendChild(style);
    rules.forEach(addStyleSheetRule, style)
}

/**
 * Add a new CSS style rule
 * @param { String } rule 
 */
function addStyleSheetRule(rule) {
    this.sheet.insertRule(rule, this.sheet.cssRules.length)
}

/**
 * Parse stylesheet's lines in single css rules
 * @param { String[] } rules 
 * @param { String } line 
 */
function parseStyleSheet(rules, line) {
    if (line[0] === '}') {
        return rules
    }

    if (line.includes('{')) {
        return rules.concat(line)
    }

    
    const previousRule = rules[rules.length - 1] 
    const selector = previousRule.split('{')[0]
    if (!previousRule.includes('}')) {
        rules[rules.length - 1] = previousRule + line + '}'
        return rules
    }

    return rules.concat(selector + ' {' + line + '}')
}

/***********
 ** UTILS **
 ***********/
function logs() {
    const [ message, ...details ] = [...arguments]
    const warning = details.reduce((parsedObject, object) => ({...parsedObject, ...object}), {})
    console.warn({message, ...warning})  
}
