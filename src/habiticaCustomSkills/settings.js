export const header = `==UserScript==
@name        habiticaCustomSkills
@version     2.1.0
@description Create new skills on Habitica by changing custom values
@include     http*://habitica.com*
@run-at 	    document-idle
@author      Marcelo 'Mark' Kopmann
==/UserScript==`

export const settings = {
    debugMode: false,
    tokens: {
        user: '',
        api: '',
    },
    icon: {
        hp: '<div opacity=".5"></path></g></svg></div>',
        mp: '<div opacity=".5"></path></g></svg></div>',
        exp: '<div opacity=".5"></path></g></svg></div>',
        gp: '<div opacity=".75"></path></g></svg></div>',
    },
    color: {
        hp: '#F74E52',
        mp: '#2995cd',
        exp: '#BF7300',
        gp: '#BF7300',
    },
    symbol: {
        flat: '',
        max: '%',
        current: '%',
        random: '?',
    },
    max: {
        hp: 'maxHealth',
        mp: 'maxMP',
        exp: 'toNextLevel',
        gp: 'gp',
    },
    defaultStats: {
        hp: 10,
        mp: 50,
        exp: 1000,
        gp: 100,
        toNextLevel: 1000,
        maxHealth: 50,
        maxMP: 100,
    },
}

export const style = `
.newSpell .img {
    background-repeat: no-repeat;
    background-position: center;
    background-size: 30px 30px
}

.newSpell .mana-text {
    padding-top: 0 !important
}

.newSpell .mana {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(147, 70, 217, 0.24) !important;
}

.newSpell .bonus {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: rgba(100, 217, 70, 0.24);
    padding: 3px 0px;
}

.newSpell .details {
    padding-top: 0px;
}

.mytooltip {
  position: relative;
  display: inline-block;
}

.mytooltip .mytooltiptext {
  margin-left: -36px;
  visibility: hidden;
  width: 300px;
  height: fit-content;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 100%;
  top: auto;
  opacity: 0;
  transition: opacity 0.3s;
}

.mytooltip .mytooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.mytooltip:hover .mytooltiptext {
  visibility: visible;
  opacity: 1;
}

`
