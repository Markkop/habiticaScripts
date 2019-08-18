// ==UserScript==
// @name        habiticaCustomSkills
// @version     1.2
// @description Creates new skills to modify custom stats
// @grant       none
// @include     http*://habitica.com*
// @run-at 	    document-idle
// ==/UserScript==

// Examples for statsChange values in skill object:
// hp: "-10M" = Consumes 10% of max hp
// mp: "-25C" = Consumes 25% of current mp
// gp: "+30F" or "+30" = Adds 30 pieces of gold
// So, M = max, C = current, F = flat

// Replace with yours: https://habitica.com/user/settings/api
const tokens = {
  user: "yourusertoken",
  api: "yourtokenapi"
};

const customSkills = [
  {
    name: "Soul Pact",
    imgSrc:
      "https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png",
    description:
      "Sacrifices health and experience to recover 10% of your max mana",
    statsChange: {
      hp: "-20M",
      mp: "+10M",
      exp: "-40M",
      gp: "0"
    }
  },
  {
    name: "Midas Touch",
    imgSrc: "http://pixeljoint.com/files/icons/goldbar.png",
    description: "Transmutes 30 gold coins by consuming mana and experience",
    statsChange: {
      hp: "0",
      mp: "-25M",
      exp: "-20M",
      gp: "+30F"
    }
  },
  {
    name: "Time Rewind",
    imgSrc:
      "https://www.pngix.com/pngfile/middle/185-1857051_stopwatch-comments-delay-clipart-transparent-hd-png-download.png",
    description:
      "Sends you back in time some moments ago consuming all your current experience and restoring 10% of your max health",
    statsChange: {
      hp: "+10",
      mp: "-70M",
      exp: "-100C",
      gp: "0"
    }
  },
  {
    name: "Exiva gold",
    imgSrc: "http://pixeljoint.com/files/icons/mh_coinzpreview.png",
    description: "Casts a power word that finds coins (test skill)",
    statsChange: {
      hp: "+0",
      mp: "-1",
      exp: "0",
      gp: "1"
    }
  }
];

/* istanbul ignore next */
const main = async () => {
  try {
    const stats = await exportFunctions.getStats();
    const buttons = createButtons(customSkills, stats);
    appendSkills(buttons);
  } catch (err) {
    console.log(err);
  }
};

/* istanbul ignore next */
const getStats = async () => {
  try {
    const resp = await fetch(
      `https://habitica.com/api/v3/members/${tokens.user}`
    );
    const data = await resp.json();
    const stats = data.data.stats;
    return stats;
  } catch (err) {
    console.log("Caugth: ", err);
  }
};

/* istanbul ignore next */
const putStats = async newStats => {
  let resp = await fetch("https://habitica.com/api/v3/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-user": `${tokens.user}`,
      "x-api-key": `${tokens.api}`,
      "x-client": `${tokens.user}-Testing`
    },
    body: JSON.stringify(newStats)
  });
  document.getElementsByClassName("top-menu-icon svg-icon")[5].click();
  console.log("The following stats were updated: ", await resp.json());
};

const createButtons = skills => {
  return skills.map(skill => {
    const divSpell = document.createElement("div");

    const divsCosts = Object.keys(skill.statsChange)
      .filter(cost => splitString(skill.statsChange[cost]).value < 0)
      .reduce((str, cost) => {
        const costObject = splitString(skill.statsChange[cost]);
        return str.concat(`
          <div data-v-d5085df8="" class="mana-text" style="padding-top: 0; display: flex; margin-bottom: 0; justify-content: center;">
            ${iconsHtml(cost)}  
          <div data-v-d5085df8="" style="color: ${costColor(
            cost
          )}">${costObject.value * -1}${
          costObject.type !== "F" ? "%" : ""
        }</div></div>`);
      }, "");

    divSpell.innerHTML = `
    <div data-v-d5085df8="" title="${
      skill.description
    }" class="spell col-12 row">
      <div data-v-d5085df8="" class="col-8 details">
        <a data-v-d5085df8="" class=""></a>
        <div style="display: inline-block; width: 40px; height: 40px" class="img shop-sprite item-img">
          <img width="35" src="${skill.imgSrc}" />
        </div>
        <span data-v-d5085df8="" class="title">${skill.name}</span>
      </div>
      <div data-v-d5085df8="" style="display: flex; flex-direction: column; justify-content: center; background-color: #e2cdfde0; max-height: 45px;" class="col-4 mana">${divsCosts}</div>
    </div>`;

    divSpell.className = "col-12 col-md-3";
    divSpell.onclick = () => onClickSkill(skill);
    return divSpell;
  });
};

const onClickSkill = async skill => {
  const currentStats = await exportFunctions.getStats();
  const newStats = changeStats(skill, currentStats);
  //Refactor so it doesn't PUT if it can't cast
  await exportFunctions.putStats(newStats);
  return newStats;
};

const appendSkills = buttons => {
  const spellContainer = document.getElementsByClassName(
    "container spell-container"
  )[0];
  if (!spellContainer) {
    alert(`The spell cointainer was not found. Try refreshing the page.`);
    return [];
  } else {
    const newSkillsDiv = document.createElement("div");
    newSkillsDiv.className = "row newSpells";

    const appendedButtons = buttons.map(button =>
      newSkillsDiv.appendChild(button)
    );

    spellContainer.appendChild(newSkillsDiv);
    return appendedButtons;
  }
};

const changeStats = (skill, currentStats) => {
  const newStats = Object.keys(skill.statsChange).map(stat => {
    const object = exportFunctions.splitString(skill.statsChange[stat]);
    if (!object.value) {
      return currentStats[stat];
    }
    switch (object.type) {
      case "M":
        const maxStat = currentStats[exportFunctions.selectMaxValues(stat)];
        return (object.value / 100) * maxStat + currentStats[stat];
      case "C":
        return (object.value / 100 + 1) * currentStats[stat];
      default:
        return object.value + currentStats[stat];
    }
  });

  const checkNewStats = newStats => {
    for (let i = 0; i < newStats.length; i++) {
      if (newStats[i] < 0) {
        const label = ["hp", "mp", "exp", "gp"];
        const message = `You require ${Math.round(
          currentStats[label[i]] + newStats[i] * -1
        )}${label[i]} to cast this skill`;
        console.log(message);
        alert(message);
        return {
          "stats.hp": currentStats["hp"],
          "stats.mp": currentStats["mp"],
          "stats.exp": currentStats["exp"],
          "stats.gp": currentStats["gp"]
        };
      }
    }

    return {
      "stats.hp": newStats[0] || currentStats["hp"],
      "stats.mp": newStats[1] || currentStats["mp"],
      "stats.exp": newStats[2] || currentStats["exp"],
      "stats.gp": newStats[3] || currentStats["gp"]
    };
  };

  return checkNewStats(newStats);
};

const selectMaxValues = stat => {
  switch (stat) {
    case "hp":
      return "maxHealth";
    case "mp":
      return "maxMP";
    case "exp":
      return "toNextLevel";
    case "gp":
      return "gp";
    default:
      return "error";
  }
};
const splitString = str => {
  const strLength = str.length;
  if (/[a-zA-Z]$/.test(str)) {
    const value = Number(str.slice(0, strLength - 1));
    const lastChar = str.slice(strLength - 1, strLength);
    return { value: value, type: lastChar };
  } else {
    return { value: Number(str), type: "F" };
  }
};

const iconsHtml = stat => {
  switch (stat) {
    case "hp":
      return '<div style="width: 16px; margin-right: 0.2em;" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#F74E52" d="M2 4.5L6.167 2 12 5.167 17.833 2 22 4.5V12l-4.167 5.833L12 22l-5.833-4.167L2 12z"></path><path fill="#FF6165" d="M7.333 16.667L3.667 11.5V5.417l2.5-1.5L12 7.083l5.833-3.166 2.5 1.5V11.5l-3.666 5.167L12 19.917z"></path><path fill="#FFF" d="M12 14.083l4.667 2.584L12 19.917z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l-4.667 2.584L12 19.917z" opacity=".35"></path><path fill="#FFF" d="M7.333 16.667L3.667 11.5 12 14.083z" opacity=".25"></path><path fill="#B52428" d="M16.667 16.667l3.666-5.167L12 14.083z" opacity=".5"></path><path fill="#B52428" d="M12 14.083l5.833-10.166 2.5 1.5V11.5z" opacity=".35"></path><path fill="#B52428" d="M12 14.083L6.167 3.917l-2.5 1.5V11.5z" opacity=".5"></path><path fill="#FFF" d="M12 14.083L6.167 3.917 12 7.083z" opacity=".5"></path><path fill="#FFF" d="M12 14.083l5.833-10.166L12 7.083z" opacity=".25"></path><path fill="#FFF" d="M9.167 14.833l-3-4.166V6.833h.083L12 9.917l5.75-3.084h.083v3.834l-3 4.166L12 16.917z" opacity=".5"></path></g></svg></div>';
    case "mp":
      return '<div style="width: 16px; margin-right: 0.2em;" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#2995CD" d="M22 15l-10 9-10-9L12 0z"></path><path fill="#50B5E9" d="M4.6 14.7l7.4-3v9.6z"></path><path fill="#1F709A" d="M12 11.7l7.4 3-7.4 6.6z" opacity=".25"></path><path fill="#FFF" d="M12 11.7V3.6l7.4 11.1z" opacity=".25"></path><path fill="#FFF" d="M4.6 14.7L12 3.6v8.1z" opacity=".5"></path><path fill="#FFF" d="M7.2 14.3L12 7.2l4.8 7.1-4.8 4.3z" opacity=".5"></path></g></svg></div>';
    case "exp":
      return '<div style="width: 16px; margin-right: 0.2em;" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="#FFA623" d="M16 16l8-4-8-4-4-8-4 8-8 4 8 4 4 8z"></path><path fill="#FFF" d="M4.5 12l5-2.5L12 12zm7.5 7.5l-2.5-5L12 12zm7.5-7.5l-5 2.5L12 12zM12 4.5l2.5 5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M19.5 12l-5-2.5L12 12z" opacity=".25"></path><path fill="#BF7D1A" d="M12 19.5l2.5-5L12 12z" opacity=".5"></path><path fill="#FFF" d="M4.5 12l5 2.5L12 12zM12 4.5l-2.5 5L12 12z" opacity=".5"></path><path fill="#FFF" d="M10.8 13.2L8.5 12l2.3-1.2L12 8.5l1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3z" opacity=".5"></path></g></svg></div>';
    case "gp":
      return '<div style="width: 16px; margin-right: 0.2em;" data-v-062fc6e8="" class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><circle cx="12" cy="12" r="12" fill="#FFA623"></circle><path fill="#FFF" d="M6.3 17.7c-3.1-3.1-3.1-8.2 0-11.3 3.1-3.1 8.2-3.1 11.3 0" opacity=".5"></path><path fill="#FFF" d="M17.7 6.3c3.1 3.1 3.1 8.2 0 11.3-3.1 3.1-8.2 3.1-11.3 0" opacity=".25"></path><path fill="#BF7D1A" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity=".5"></path><path fill="#BF7D1A" d="M13 9v2h-2V9H9v6h2v-2h2v2h2V9z" opacity=".75"></path></g></svg></div>';
  }
};

const costColor = stat => {
  switch (stat) {
    case "hp":
      return "#F74E52";
    case "mp":
      return "#2995cd";
    case "exp":
      return "#BF7300";
    case "gp":
      return "#BF7300";
  }
};

// Functions need to be exported this way so
// they can be correctly mocked in the test file
// Also, mocked functions should be used such as
// exportFunctions.getStats()

const exportFunctions = {
  appendSkills,
  createButtons,
  changeStats,
  getStats,
  putStats,
  onClickSkill,
  splitString,
  selectMaxValues,
  main
};

// Uncomment this to test this file
export default exportFunctions;

/* istanbul ignore next */
if (document.body) {
  // Wait 3s before running the script
  setTimeout(() => main(), 3000);
}
