// ==UserScript==
// @name        habiticaCustomSkills
// @version     2.0
// @description Creates new skills to modify custom stats
// @grant       none
// @include     http*://habitica.com*
// @run-at 	    document-idle
// ==/UserScript==

// Examples for statsChange values in skill object:
// hp: "-10M" = Consumes 10% of max hp
// mp: "-25C" = Consumes 25% of current mp
// gp: "+30F" or "+30" = Adds 30 pieces of gold
// gp: "10R" = Adds a random number of gold between 1 and 10
// So, M = max, C = current, F = flat, R = random (flat)

// Replace with yours: https://habitica.com/user/settings/api

const tokens = {
    user: 'yourusertoken',
    api: 'yourtokenapi',
  };
  
const customSkills = [
{
    name: 'Soul Pact',
    imgSrc:
    'https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png',
    description:
    'Sacrifices health and experience to recover 10% of your max mana',
    statsChange: {
    hp: '-20M',
    mp: '+10M',
    exp: '-40M',
    gp: '0',
    },
},
{
    name: 'Midas Touch',
    imgSrc: 'http://pixeljoint.com/files/icons/goldbar.png',
    description: 'Transmutes 10 gold coins by consuming mana and experience',
    statsChange: {
    hp: '0',
    mp: '-25M',
    exp: '-20M',
    gp: '+10F',
    },
},
{
    name: 'Time Rewind',
    imgSrc:
    'https://www.pngix.com/pngfile/middle/185-1857051_stopwatch-comments-delay-clipart-transparent-hd-png-download.png',
    description:
    'Sends you back in time some moments ago consuming all your current experience and restoring 10% of your max health',
    statsChange: {
    hp: '+10',
    mp: '-70M',
    exp: '-100C',
    gp: '0',
    },
},
{
    name: 'Find Gold',
    imgSrc: 'http://pixeljoint.com/files/icons/mh_coinzpreview.png',
    description: 'Casts a power word that finds a random quantity of coins',
    statsChange: {
    hp: '+0',
    mp: '-5M',
    exp: '0',
    gp: '10R',
    },
},
];


function createSpells() {
    const spellContainer = document.querySelector('.spell-container')
    const dataAttribute = spellContainer.getAttributeNames().find(att => att.includes('data'))
    const spellRow = spellContainer.firstElementChild
    const existingSpell = spellRow.firstElementChild
    
    customSkills.forEach(spell => {
        const newSpell = existingSpell.cloneNode(true)
        const title = newSpell.querySelector('.title')
        title.innerText = spell.name
        const img =  newSpell.querySelector('.img')
        img.style.backgroundImage = `url('${spell.imgSrc}')`
        img.style.backgroundRepeat = 'no-repeat'
        img.style.backgroundPosition = 'center'
        img.style.backgroundSize = '30px 30px'

        spellRow.appendChild(newSpell)
    })
    
}

function main() {
    try {
        console.log('Start')
        createSpells()
    } catch (error) {
        console.log(error)
    }
}

setTimeout(main, 3000)