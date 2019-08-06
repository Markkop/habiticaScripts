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
    changeHp: "-10",
    changeExp: "-10",
    changeMp: "+10"
  },
  {
    name: "Test Mp Gain",
    changeMp: "+1"
  },
  {
    name: "Test Mp Loss",
    changeMp: "-1"
  }
];

//console.log(/\%$/g.test(skill.changeHP));
const createButtons = (skills, stats) => {
  if (!skills || !stats) {
    throw new Error("No input at createbuttons");
  }

  return skills.map(skill => {
    const btn = document.createElement("BUTTON");
    btn.innerHTML = `${skill.name}<br />
                    HP:   ${skill.changeHp || "0"}% MAXHP<br />
                    EXP:  ${skill.changeExp || "0"}% MAXEXP<br />
                    MP:   ${skill.changeMp || "0"}% MAXMP<br />
                    GP:   ${skill.changeGp || "0"}`;

    const newStats = changedStats(skill, stats);
    addEvent(btn, putStats, newStats);
    return btn;
  });
};
const changedStats = (skill, currentStats) => {
  return {
    "stats.hp": ((skill.changeHp || 0) / 100 + 1) * currentStats.hp,
    "stats.mp": ((skill.changeMp || 0) / 100 + 1) * currentStats.mp,
    "stats.exp": ((skill.changeExp || 0) / 100 + 1) * currentStats.exp,
    "stats.gp": ((skill.changeGp || 0) / 100 + 1) * currentStats.gp
  };
};

const addEvent = (button, onClickFunction, newStats) => {
  return button.addEventListener("click", () => onClickFunction(newStats));
};

const appendSkills = buttons => {
  const spellsDiv = document.getElementsByClassName("drawer-slider")[0];
  buttons.forEach(button => spellsDiv.appendChild(button));
};

// const necroSkill = async stats => {
//   const newStats = {
//     "stats.hp": stats.hp * 0.5,
//     "stats.mp": stats.mp * 1.1,
//     "stats.exp": stats.exp * 0.5
//   };
//   console.log(newStats);
//   console.log(await putStats(newStats));
//   alert(`Necromicon usado.\n
//       Você perde ${Math.round(
//         newStats["stats.hp"] - stats.hp
//       )} HP, ${Math.round(newStats["stats.exp"] - stats.exp)} EXP\n
//       Você ganha ${Math.round(newStats["stats.mp"] - stats.mp)} MP`);
//   location.reload();
// };

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

// To make it work on Habitica, remove exports
// and call main() below
// (perhaps it doens't recognize ES6?)

const exportFunctions = {
  main,
  addEvent,
  createButtons
};

export default exportFunctions;
