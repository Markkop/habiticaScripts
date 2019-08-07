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
      "https://gamepedia.cursecdn.com/wizardoflegend_gamepedia_en/thumb/1/11/Raging_Inferno.png/128px-Raging_Inferno.png",
    multiplier: {
      hp: "-10",
      mp: "-10",
      exp: "+10",
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
        return str.concat(
          `<div data-v-d5085df8="" class="mana-text" style="padding-top: 0"><div data-v-d5085df8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#2995CD" d="M22 15l-10 9-10-9L12 0z"></path><path fill="#50B5E9" d="M4.6 14.7l7.4-3v9.6z"></path><path fill="#1F709A" d="M12 11.7l7.4 3-7.4 6.6z" opacity=".25"></path><path fill="#FFF" d="M12 11.7V3.6l7.4 11.1z" opacity=".25"></path><path fill="#FFF" d="M4.6 14.7L12 3.6v8.1z" opacity=".5"></path><path fill="#FFF" d="M7.2 14.3L12 7.2l4.8 7.1-4.8 4.3z" opacity=".5"></path></g></svg></div><div data-v-d5085df8="">${
            skill.multiplier[cost]
          }%</div></div>`
        );
      }, "");

    divSpell.innerHTML = `<div data-v-d5085df8="" class="spell col-12 row"><div data-v-d5085df8="" class="col-8 details"><a data-v-d5085df8="" class=""></a><div style="display: inline-block; width: 40px; height: 40px" class="img shop-sprite item-img"><img width="35" src="${
      skill.imgSrc
    }" /></div><span data-v-d5085df8="" class="title">${
      skill.name
    }</span></div><div data-v-d5085df8="" style="display: flex; flex-direction: column; justify-content: center" class="col-4 mana">${divsCosts}</div></div>`;
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
  await console.log("Put Stats: ", await resp.json());
};

const getStats = async () => {
  const resp = await fetch(
    "https://habitica.com/api/v3/members/***REMOVED***"
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

// Uncomment below to use it on Greasemonkey
main();

// Uncomment below to allow testing
// const exportFunctions = {
//   main,
//   addEvent,
//   createButtons
// };

// export default exportFunctions;
