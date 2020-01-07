// ==UserScript==
// @name        habiticaCustomSkills
// @version     2.0
// @description Create new habitica skills to modify user stats
// @grant       none
// @include     http*://habitica.com*
// @run-at 	    document-idle
// ==/UserScript==

// To do: first cast is taking decimal stat values into account; make it ignore them

// Replace with yours: https://habitica.com/user/settings/api
const tokens = {
    user: '',
    api: '',
};
  
const customSkills = [
    {
        name: 'Soul Pact',
        imgSrc:
            'https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png',
        description:
            'Sacrifices health and experience to recover 10% of your max mana',
        stats: {
            hp: { value: -20, type: 'max'},
            mp: { value: +10, type: 'max'},
            exp: { value: -40, type: 'max'},
        },
    },
    {
        name: 'Midas Touch',
        imgSrc: 
            'http://pixeljoint.com/files/icons/goldbar.png',
        description: 
            'Transmutes 10 gold coins by consuming mana and experience',
        stats: {
            mp: { value: -25, type: 'max'},
            exp: { value: -20, type: 'max'},
            gp: { value: +10, type: 'flat' }
        }
    },
    {
        name: 'Time Rewind',
        imgSrc:
            'https://www.pngix.com/pngfile/middle/185-1857051_stopwatch-comments-delay-clipart-transparent-hd-png-download.png',
        description:
            'Sends you back in time some moments ago consuming all your current experience and restoring 10% of your max health',
        stats: {
            hp: { value: +10, type: 'max'},
            mp: { value: -70, type: 'max'},
            exp: { value: -100, type: 'current'},
        }
    },
    {
        name: 'Find Gold',
        imgSrc: 
            'http://pixeljoint.com/files/icons/mh_coinzpreview.png',
        description: 
            'Casts a power word that finds a random quantity of coins',
        stats: {
            mp: { value: -5, type: 'max'},
            gp: { value: +10, type: 'random' }
        },
    },
];

const iconMap = {
    hp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#F74E52" d="M2 4.5L6.167 2 12 5.167 17.833 2 22 4.5V12l-4.167 5.833L12 22l-5.833-4.167L2 12z"></path><path fill="#FF6165" d="M7.333 16.667L3.667 11.5V5.417l2.5-1.5L12 7.083l5.833-3.166 2.5 1.5V11.5l-3.666 5.167L12 19.917z"></path><path fill="#FFF" d="M12 14.083l4.667 2.584L12 19.917z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l-4.667 2.584L12 19.917z" opacity=".35"></path><path fill="#FFF" d="M7.333 16.667L3.667 11.5 12 14.083z" opacity=".25"></path><path fill="#B52428" d="M16.667 16.667l3.666-5.167L12 14.083z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l5.833-10.166 2.5 1.5V11.5z" opacity=".35"></path><path fill="#B52428" d="M12 14.083L6.167 3.917l-2.5 1.5V11.5z" opacity=".5"></path><path fill="#FFF" d="M12 14.083L6.167 3.917 12 7.083z" opacity=".5"></path><path fill="#FFF" d="M12 14.083l5.833-10.166L12 7.083z" opacity=".25"></path><path fill="#FFF" d="M9.167 14.833l-3-4.166V6.833h.083L12 9.917l5.75-3.084h.083v3.834l-3 4.166L12 16.917z" opacity=".5"></path></g></svg></div>',
    mp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#2995CD" d="M22 15l-10 9-10-9L12 0z"></path><path fill="#50B5E9" d="M4.6 14.7l7.4-3v9.6z"></path><path fill="#1F709A" d="M12 11.7l7.4 3-7.4 6.6z" opacity=".25"></path><path fill="#FFF" d="M12 11.7V3.6l7.4 11.1z" opacity=".25"></path><path fill="#FFF" d="M4.6 14.7L12 3.6v8.1z" opacity=".5"></path><path fill="#FFF" d="M7.2 14.3L12 7.2l4.8 7.1-4.8 4.3z" opacity=".5"></path></g></svg></div>',
    exp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#FFA623" d="M16 16l8-4-8-4-4-8-4 8-8 4 8 4 4 8z"></path><path fill="#FFF" d="M4.5 12l5-2.5L12 12zm7.5 7.5l-2.5-5L12 12zm7.5-7.5l-5 2.5L12 12zM12 4.5l2.5 5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M19.5 12l-5-2.5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M12 19.5l2.5-5L12 12z" opacity=".5"></path><path fill="#FFF" d="M4.5 12l5 2.5L12 12zM12 4.5l-2.5 5L12 12z" opacity=".5"></path><path fill="#FFF" d="M10.8 13.2L8.5 12l2.3-1.2L12 8.5l1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3z" opacity=".5"></path></g></svg></div>',
    gp: '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle cx="12" cy="12" r="12" fill="#FFA623"></circle><path fill="#FFF" d="M6.3 17.7c-3.1-3.1-3.1-8.2 0-11.3 3.1-3.1 8.2-3.1 11.3 0" opacity=".5"></path><path fill="#FFF" d="M17.7 6.3c3.1 3.1 3.1 8.2 0 11.3-3.1 3.1-8.2 3.1-11.3 0" opacity=".25"></path><path fill="#BF7D1A" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity=".5"></path><path fill="#BF7D1A" d="M13 9v2h-2V9H9v6h2v-2h2v2h2V9z" opacity=".75"></path></g></svg></div>'
}

const colorMap = {
    hp: '#F74E52',
    mp: '#2995cd',
    exp: '#BF7300',
    gp: '#BF7300'
}

const typeMap = {
    flat: '',
    max: '%',
    current: '%',
    random: '?'
}

const getStats = async () => {
    try {
      const resp = await fetch(
        `https://habitica.com/api/v3/members/${tokens.user}`
      );
      const respJson = await resp.json();
      const stats = respJson.data.stats;
      return stats;
    } catch (err) {
      console.log('Caugth: ', err);
    }
};

// Use test file to develop this function
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
        const integer = Number(String(current).split('.')[0])
        const decimal = String(current).split('.')[1]
        const max = currentStats[maxMap[stat]]

        const modifierMap = {
            flat: integer + value,
            max: integer + (max/100 * value),
            current: integer + (current/100 * value),
            random: integer + Math.floor(Math.random() * (value - 1)) + 1
        }

        return {
            ...newStats,
            ['stats.'+stat]: Number(Math.round(modifierMap[type || 'flat']) + '.' + decimal)
        }
        
    }, {})
}

// Use test file to develop this function
const checkRequirements = (newStats, currentStats) => {
    const newStatsKeys = Object.keys(newStats);
  
    return newStatsKeys.reduce((result, statKey) => {
        const stat = statKey.split('.')[1]
        const value = newStats[statKey]
        const requiredValue = (currentStats[stat] + value * -1).toFixed(2)
        const message = `You need ${requiredValue} ${stat} to cast this skill`

        if (value < 0) {
            console.log(message)
            alert(message)
            return false
        }

        return result

    }, true)
};

const putStats = async newStats => {
    let resp = await fetch('https://habitica.com/api/v3/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-user': `${tokens.user}`,
        'x-api-key': `${tokens.api}`,
        'x-client': `${tokens.user}-Testing`,
      },
      body: JSON.stringify(newStats),
    });
    document.querySelector('[role=link]').click()
};


// To do: split this function in more functions
// To do: change firstElementChild to something better
// To do: refactor style insertion
function createSpells() {
    const spellContainer = document.querySelector('.spell-container')
    const spellRow = spellContainer.firstElementChild
    const existingSpell = spellRow.firstElementChild
    
    customSkills.forEach(spell => {
        const newSpell = existingSpell.cloneNode(true)

        // Spell title
        const title = newSpell.querySelector('.title')
        title.innerText = spell.name

        // Spell image
        const img =  newSpell.querySelector('.img')
        img.style.backgroundImage = `url('${spell.imgSrc}')`
        img.style.backgroundRepeat = 'no-repeat'
        img.style.backgroundPosition = 'center'
        img.style.backgroundSize = '30px 30px'

        // Spell costs
        const resources = newSpell.querySelector('.mana')
        resources.style.display = 'flex'
        resources.style.flexFlow = 'column'
        resources.style.alignItems = 'center'
        resources.style.justifyContent = 'center'
        const mana = newSpell.querySelector('.mana-text')
        resources.removeChild(mana)

        const spellStats = Object.keys(spell.stats)
        spellStats.forEach(stat => {
            const value = spell.stats[stat].value
            const type = spell.stats[stat].type

            if (value >= 0) {
                return
            }

            const newStat = mana.cloneNode(true)
            newStat.style.paddingTop = '0'

            const costIcon = newStat.firstElementChild
            costIcon.innerHTML = iconMap[stat]

            const costText = newStat.lastElementChild
            costText.innerText = value + typeMap[type]
            costText.style.color = colorMap[stat]
            
            resources.appendChild(newStat)
        })

        // Spell behavior
        const spellButton = newSpell.firstElementChild
        spellButton.onclick = async () => {
            const currentStats = await getStats()
            const newStats = changeStats(spell.stats, currentStats)
            const canCastSpell = checkRequirements(newStats, currentStats)

            if (canCastSpell) {
                await putStats(newStats)
            }

        }

        spellRow.appendChild(newSpell)
    })
    
}

function main() {
    try {
        console.log('Starting habiticaCustomSkills script')

        if (!tokens.api || !tokens.user) {
            alert('habiticaCustomSkills script: No tokens found, did you forget to insert them?')
            return
        }

        // To do: split createSpells() into more functions
        createSpells()
    } catch (error) {
        console.log(error)
    }
}


// To do: find a better way to check if the page has completely loaded
setTimeout(main, 3000)