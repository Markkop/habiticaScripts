import exportFunctions from "./customSkills";

//Mocked functions
exportFunctions.putStats = jest.fn(() => {});
exportFunctions.getStats = jest.fn(() => stats);
exportFunctions.main = jest.fn(() => console.log("mockupmain"));
window.alert = jest.fn(() => console.log("Alerted"));

const skills = [
  {
    name: "Soul Pact",
    imgSrc:
      "https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png",
    statsChange: {
      hp: "-10M",
      mp: "-10C",
      exp: "+10M",
      gp: "0"
    }
  },
  {
    name: "Midas Touch",
    imgSrc: "http://pixeljoint.com/files/icons/goldbar.png",
    statsChange: {
      hp: "0",
      mp: "-20M",
      exp: "-10C",
      gp: "30F"
    }
  },
  {
    name: "High Cost",
    imgSrc: "http://pixeljoint.com/files/icons/goldbar.png",
    statsChange: {
      hp: "-99M",
      mp: "0",
      exp: "0",
      gp: "0"
    }
  }
];

const stats = {
  hp: 30,
  mp: 40,
  exp: 50,
  gp: 50,
  maxHealth: 50,
  maxMP: 100,
  toNextLevel: 250
};

describe("createButtons", () => {
  it("creates three buttons", () => {
    expect(exportFunctions.createButtons).toBeDefined();
    const buttons = exportFunctions.createButtons(skills, stats);
    expect(buttons).toHaveLength(3);
  });

  it("it throws an error if no inputs are provided", () => {
    expect(() => {
      exportFunctions.createButtons();
    }).toThrow();
  });

  it("adds onclick event", () => {
    const buttons = exportFunctions.createButtons(skills, stats);
    expect(buttons[0]).toHaveProperty("onclick", expect.anything());
    expect(buttons[1]).toHaveProperty("onclick", expect.anything());
  });
});

describe("changeStats", () => {
  it("apply modifiers correctly", () => {
    expect(exportFunctions.changeStats).toBeDefined();
    const soulPactStats = exportFunctions.changeStats(skills[0], stats);
    expect(soulPactStats).toStrictEqual({
      "stats.hp": 25,
      "stats.mp": 36,
      "stats.exp": 75,
      "stats.gp": 50
    });

    const midasTouchStats = exportFunctions.changeStats(skills[1], stats);
    expect(midasTouchStats).toStrictEqual({
      "stats.hp": 30,
      "stats.mp": 20,
      "stats.exp": 45,
      "stats.gp": 80
    });

    const highCostStats = exportFunctions.changeStats(skills[2], stats);
    expect(highCostStats).toStrictEqual({
      "stats.hp": stats.hp,
      "stats.mp": stats.mp,
      "stats.exp": stats.exp,
      "stats.gp": stats.gp
    });
    expect(window.alert).toHaveBeenCalled();
  });
});

describe("splitStatsChange", () => {
  expect(exportFunctions.splitString).toBeDefined();

  it("splits correctly", () => {
    const plusMax = exportFunctions.splitString("+10M");
    expect(plusMax).toStrictEqual({ value: 10, type: "M" });

    const minusMax = exportFunctions.splitString("-5M");
    expect(minusMax).toStrictEqual({ value: -5, type: "M" });

    const plusCurrent = exportFunctions.splitString("30C");
    expect(plusCurrent).toStrictEqual({ value: 30, type: "C" });

    const minusFlat = exportFunctions.splitString("-10F");
    expect(minusFlat).toStrictEqual({ value: -10, type: "F" });

    const noLetter = exportFunctions.splitString("-20");
    expect(noLetter).toStrictEqual({ value: -20, type: "F" });
  });
});

describe("onClickSkill", () => {
  it("calls mock functions", async () => {
    expect(exportFunctions.onClickSkill).toBeDefined();
    exportFunctions.onClickSkill(skills[0]);

    expect(await exportFunctions.getStats).toHaveBeenCalled();
    expect(await exportFunctions.putStats).toHaveBeenCalled();
  });
});

describe("appendSkills", () => {
  const spellContainer = document.createElement("div");
  spellContainer.className = "container spell-container";
  document.body.appendChild(spellContainer);

  it("appends the right number of buttons", () => {
    const buttons = exportFunctions.createButtons(skills, stats);
    const newSkillsDiv = exportFunctions.appendSkills(buttons);
    expect(newSkillsDiv).toHaveLength(3);
  });
});

describe("main", () => {
  it("runs with mockup", async () => {
    exportFunctions.main();
    expect(await exportFunctions.getStats).toHaveBeenCalled();
  });
});
