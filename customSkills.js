// ==UserScript==
// @name        habiticaCustomSkills
// @version     0.1
// @description Creates new skills to modify custom stats
// @grant       none
// @include     http*://habitica.com*
// @run-at 	    document-idle
// ==/UserScript==

// To Do:
// Styling
// Not only %max values
// Prettier notifications

// All values changes are based on max value
// eg. changeHp: "-10" => -10% Max HP

const customSkills = [
  {
    name: "Soul Pact",
    imgSrc:
      "https://www.pngix.com/pngfile/big/95-951782_luciditynexus-pack-magic-circle-png-transparent-png.png",
    multiplier: {
      hp: "-10",
      mp: "-10",
      exp: "-10",
      gp: "0"
    }
  },
  {
    name: "Test Mp Gain",
    imgSrc:
      "https://gamepedia.cursecdn.com/wizardoflegend_gamepedia_en/thumb/1/11/Raging_Inferno.png/128px-Raging_Inferno.png",
    multiplier: {
      hp: "0",
      mp: "+1",
      exp: "0",
      gp: "0"
    }
  },
  {
    name: "Test Mp Loss",
    imgSrc:
      "https://gamepedia.cursecdn.com/wizardoflegend_gamepedia_en/thumb/1/11/Raging_Inferno.png/128px-Raging_Inferno.png",
    multiplier: {
      hp: "0",
      mp: "-1",
      exp: "0",
      gp: "0"
    }
  }
];

//console.log(/\%$/g.test(skill.changeHP));
const createButtons = (skills, stats) => {
  if (!skills || !stats) {
    throw new Error("No input at createbuttons");
  }

  return skills.map(skill => {
    console.log(skill);
    const divSpell = document.createElement("div");
    const style = "width: 40px";

    const divsCosts = Object.keys(skill.multiplier)
      .filter(cost => skill.multiplier[cost] < 0)
      .reduce((str, cost) => {
        return str.concat(`
          <div data-v-d5085df8="" class="mana-text" style="padding-top: 0; display: flex; margin-bottom: 0">
            ${iconsHtml(cost)}  
          <div data-v-d5085df8="" style="color: ${costColor(cost)}">${skill.multiplier[cost]}%</div></div>`
        );
      }, "");

    divSpell.innerHTML = `
    <div data-v-d5085df8="" class="spell col-12 row">
      <div data-v-d5085df8="" class="col-8 details">
        <a data-v-d5085df8="" class=""></a>
        <div style="display: inline-block; width: 40px; height: 40px" class="img shop-sprite item-img">
          <img width="35" src="${skill.imgSrc}" />
        </div>
        <span data-v-d5085df8="" class="title">${skill.name}</span>
      </div>
      <div data-v-d5085df8="" style="display: flex; flex-direction: column; justify-content: center; background-color: #b29fc5; max-height: 45px;" class="col-4 mana">${divsCosts}</div>
    </div>`;

    divSpell.className = "col-12 col-md-3";

    const newStats = changedStats(skill, stats);
    addEvent(divSpell, putStats, newStats);
    return divSpell;
  });
};
const changedStats = (skill, currentStats) => {
  return {
    "stats.hp": ((skill.multiplier.hp || 0) / 100 + 1) * currentStats.hp,
    "stats.mp": ((skill.multiplier.mp || 0) / 100 + 1) * currentStats.mp,
    "stats.exp": ((skill.multiplier.exp || 0) / 100 + 1) * currentStats.exp,
    "stats.gp": ((skill.multiplier.gp || 0) / 100 + 1) * currentStats.gp
  };
};

const addEvent = (button, onClickFunction, newStats) => {
  return button.addEventListener("click", () => onClickFunction(newStats));
};

const appendSkills = buttons => {
  const div = document.createElement("div");
  div.className = "row newSpells";

  buttons.forEach(button => div.appendChild(button));

  const spellContainer = document.getElementsByClassName(
    "container spell-container"
  )[0];

  if (!spellContainer) {
    console.log(
      `spellContainer is ${spellContainer}, maybe spells weren't loaded yet`
    );
  }

  spellContainer.appendChild(div);
};

const putStats = async newStats => {
  //console.log("newStats: ", JSON.stringify(newStats));
  let resp = await fetch("https://habitica.com/api/v3/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-user": "userid",
      "x-api-key": "tokenapi",
      "x-client": "userid-Testing"
    },
    body: JSON.stringify(newStats)
  });
  //const data = await resp.json();
  document.getElementsByClassName("top-menu-icon svg-icon")[5].click();
  await console.log("Put Stats: ", await resp.json());
};

const getStats = async () => {
  const resp = await fetch(
    "https://habitica.com/api/v3/members/40387571-91ee-489e-960f-278bf8fd503a"
  );
  const data = await resp.json();
  const stats = data.data.stats;
  //console.log("Stats via getStats ", stats);
  return stats;
};

const main = async () => {
  try {
    console.log("CustomSkills script is running...");
    const stats = await getStats();
    const buttons = createButtons(customSkills, stats);
    appendSkills(buttons);
  } catch (err) {
    console.log("Caught:", err);
  }
};

const iconsHtml = stat => {
  switch (stat) {
    case "hp":
      return '<div style="width: 16px" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#F74E52" d="M2 4.5L6.167 2 12 5.167 17.833 2 22 4.5V12l-4.167 5.833L12 22l-5.833-4.167L2 12z"></path><path fill="#FF6165" d="M7.333 16.667L3.667 11.5V5.417l2.5-1.5L12 7.083l5.833-3.166 2.5 1.5V11.5l-3.666 5.167L12 19.917z"></path><path fill="#FFF" d="M12 14.083l4.667 2.584L12 19.917z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l-4.667 2.584L12 19.917z" opacity=".35"></path><path fill="#FFF" d="M7.333 16.667L3.667 11.5 12 14.083z" opacity=".25"></path><path fill="#B52428" d="M16.667 16.667l3.666-5.167L12 14.083z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l5.833-10.166 2.5 1.5V11.5z" opacity=".35"></path><path fill="#B52428" d="M12 14.083L6.167 3.917l-2.5 1.5V11.5z" opacity=".5"></path><path fill="#FFF" d="M12 14.083L6.167 3.917 12 7.083z" opacity=".5"></path><path fill="#FFF" d="M12 14.083l5.833-10.166L12 7.083z" opacity=".25"></path><path fill="#FFF" d="M9.167 14.833l-3-4.166V6.833h.083L12 9.917l5.75-3.084h.083v3.834l-3 4.166L12 16.917z" opacity=".5"></path></g></svg></div>';
    case "mp":
      return '<div style="width: 16px" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#2995CD" d="M22 15l-10 9-10-9L12 0z"></path><path fill="#50B5E9" d="M4.6 14.7l7.4-3v9.6z"></path><path fill="#1F709A" d="M12 11.7l7.4 3-7.4 6.6z" opacity=".25"></path><path fill="#FFF" d="M12 11.7V3.6l7.4 11.1z" opacity=".25"></path><path fill="#FFF" d="M4.6 14.7L12 3.6v8.1z" opacity=".5"></path><path fill="#FFF" d="M7.2 14.3L12 7.2l4.8 7.1-4.8 4.3z" opacity=".5"></path></g></svg></div>'
    case "exp":
      return '<div style="width: 16px" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#FFA623" d="M16 16l8-4-8-4-4-8-4 8-8 4 8 4 4 8z"></path><path fill="#FFF" d="M4.5 12l5-2.5L12 12zm7.5 7.5l-2.5-5L12 12zm7.5-7.5l-5 2.5L12 12zM12 4.5l2.5 5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M19.5 12l-5-2.5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M12 19.5l2.5-5L12 12z" opacity=".5"></path><path fill="#FFF" d="M4.5 12l5 2.5L12 12zM12 4.5l-2.5 5L12 12z" opacity=".5"></path><path fill="#FFF" d="M10.8 13.2L8.5 12l2.3-1.2L12 8.5l1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3z" opacity=".5"></path></g></svg></div>'
    case "gp":
      return '<div style="width: 16px" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle cx="12" cy="12" r="12" fill="#FFA623"></circle><path fill="#FFF" d="M6.3 17.7c-3.1-3.1-3.1-8.2 0-11.3 3.1-3.1 8.2-3.1 11.3 0" opacity=".5"></path><path fill="#FFF" d="M17.7 6.3c3.1 3.1 3.1 8.2 0 11.3-3.1 3.1-8.2 3.1-11.3 0" opacity=".25"></path><path fill="#BF7D1A" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity=".5"></path><path fill="#BF7D1A" d="M13 9v2h-2V9H9v6h2v-2h2v2h2V9z" opacity=".75"></path></g></svg></div>'
    default:
      return '<div class="no valid stat selected"></div>'
  }
};

const costColor = stat => {
  switch (stat) {
    case "hp":
      return '#F74E52';
    case "mp":
      return '#2995cd'
    case "exp":
      return '#FFBE5D'
    case "gp":
      return '#fd7e14'
    default:
      return 'no color'
  }
};

// Uncomment below to use it on Greasemonkey
main();

// Uncomment below to allow testing
// const exportFunctions = {
//   main,
//   addEvent,
//   createButtons
// };

// export default exportFunctions;