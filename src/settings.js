export const settings = {
    debugMode: false,
    tokens: {
        user: '',
        api: '',
    },
    icon: {
        hp:
            '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#F74E52" d="M2 4.5L6.167 2 12 5.167 17.833 2 22 4.5V12l-4.167 5.833L12 22l-5.833-4.167L2 12z"></path><path fill="#FF6165" d="M7.333 16.667L3.667 11.5V5.417l2.5-1.5L12 7.083l5.833-3.166 2.5 1.5V11.5l-3.666 5.167L12 19.917z"></path><path fill="#FFF" d="M12 14.083l4.667 2.584L12 19.917z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l-4.667 2.584L12 19.917z" opacity=".35"></path><path fill="#FFF" d="M7.333 16.667L3.667 11.5 12 14.083z" opacity=".25"></path><path fill="#B52428" d="M16.667 16.667l3.666-5.167L12 14.083z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l5.833-10.166 2.5 1.5V11.5z" opacity=".35"></path><path fill="#B52428" d="M12 14.083L6.167 3.917l-2.5 1.5V11.5z" opacity=".5"></path><path fill="#FFF" d="M12 14.083L6.167 3.917 12 7.083z" opacity=".5"></path><path fill="#FFF" d="M12 14.083l5.833-10.166L12 7.083z" opacity=".25"></path><path fill="#FFF" d="M9.167 14.833l-3-4.166V6.833h.083L12 9.917l5.75-3.084h.083v3.834l-3 4.166L12 16.917z" opacity=".5"></path></g></svg></div>',
        mp:
            '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#2995CD" d="M22 15l-10 9-10-9L12 0z"></path><path fill="#50B5E9" d="M4.6 14.7l7.4-3v9.6z"></path><path fill="#1F709A" d="M12 11.7l7.4 3-7.4 6.6z" opacity=".25"></path><path fill="#FFF" d="M12 11.7V3.6l7.4 11.1z" opacity=".25"></path><path fill="#FFF" d="M4.6 14.7L12 3.6v8.1z" opacity=".5"></path><path fill="#FFF" d="M7.2 14.3L12 7.2l4.8 7.1-4.8 4.3z" opacity=".5"></path></g></svg></div>',
        exp:
            '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#FFA623" d="M16 16l8-4-8-4-4-8-4 8-8 4 8 4 4 8z"></path><path fill="#FFF" d="M4.5 12l5-2.5L12 12zm7.5 7.5l-2.5-5L12 12zm7.5-7.5l-5 2.5L12 12zM12 4.5l2.5 5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M19.5 12l-5-2.5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M12 19.5l2.5-5L12 12z" opacity=".5"></path><path fill="#FFF" d="M4.5 12l5 2.5L12 12zM12 4.5l-2.5 5L12 12z" opacity=".5"></path><path fill="#FFF" d="M10.8 13.2L8.5 12l2.3-1.2L12 8.5l1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3z" opacity=".5"></path></g></svg></div>',
        gp:
            '<div data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle cx="12" cy="12" r="12" fill="#FFA623"></circle><path fill="#FFF" d="M6.3 17.7c-3.1-3.1-3.1-8.2 0-11.3 3.1-3.1 8.2-3.1 11.3 0" opacity=".5"></path><path fill="#FFF" d="M17.7 6.3c3.1 3.1 3.1 8.2 0 11.3-3.1 3.1-8.2 3.1-11.3 0" opacity=".25"></path><path fill="#BF7D1A" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity=".5"></path><path fill="#BF7D1A" d="M13 9v2h-2V9H9v6h2v-2h2v2h2V9z" opacity=".75"></path></g></svg></div>',
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
 * @typedef ValidStats
 * @property { number } [stats.hp]
 * @property { number } [stats.mp]
 * @property { number } [stats.exp]
 * @property { number } [stats.gp]
 */

/**
 * @typedef ChangedStats
 * @property { number } [hp]
 * @property { number } [mp]
 * @property { number } [exp]
 * @property { number } [gp]
 */

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
