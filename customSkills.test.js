import exportFunctions from "./customSkills";

//Mocked functions
exportFunctions.putStats = jest.fn(() => {});
exportFunctions.getStats = jest.fn(() => stats);
exportFunctions.main = jest.fn(() => console.log("mockupmain"));

const skills = [
  {
    name: "Soul Pact",
    imgSrc:
      "https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png",
    multiplier: {
      hp: "-10M",
      mp: "-10C",
      exp: "+10M",
      gp: "0"
    }
  },
  {
    name: "Midas Touch",
    imgSrc: "http://pixeljoint.com/files/icons/goldbar.png",
    multiplier: {
      hp: "0",
      mp: "-20M",
      exp: "-10C",
      gp: "30F"
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
  it("creates two buttons", () => {
    expect(exportFunctions.createButtons).toBeDefined();
    const buttons = exportFunctions.createButtons(skills, stats);
    expect(buttons).toHaveLength(2);
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

describe("changedStats", () => {
  it("apply modifiers correctly", () => {
    expect(exportFunctions.changedStats).toBeDefined();
    const soulPactStats = exportFunctions.changedStats(skills[0], stats);
    expect(soulPactStats).toStrictEqual({
      "stats.hp": 25,
      "stats.mp": 36,
      "stats.exp": 75,
      "stats.gp": 50
    });

    const midasTouchStats = exportFunctions.changedStats(skills[1], stats);
    expect(midasTouchStats).toStrictEqual({
      "stats.hp": 30,
      "stats.mp": 20,
      "stats.exp": 45,
      "stats.gp": 80
    });
  });
});

describe("splitValue", () => {
  expect(exportFunctions.splitValue).toBeDefined();

  it("splits correctly", () => {
    const plusMax = exportFunctions.splitValue("+10M");
    expect(plusMax).toStrictEqual({ value: 10, type: "M" });

    const minusMax = exportFunctions.splitValue("-5M");
    expect(minusMax).toStrictEqual({ value: -5, type: "M" });

    const plusCurrent = exportFunctions.splitValue("30C");
    expect(plusCurrent).toStrictEqual({ value: 30, type: "C" });

    const minusFlat = exportFunctions.splitValue("-10F");
    expect(minusFlat).toStrictEqual({ value: -10, type: "F" });

    const noLetter = exportFunctions.splitValue("-20");
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
    expect(newSkillsDiv).toHaveLength(2);
  });
});

describe("main", () => {
  it("runs with mockup", async () => {
    exportFunctions.main();
    expect(await exportFunctions.getStats).toHaveBeenCalled();
  });
});
