import exportFunctions from "./customSkills";

//Mocked functions
exportFunctions.putStats = jest.fn(() => {});
exportFunctions.getStats = jest.fn(() => stats.json);
exportFunctions.main = jest.fn(() => {});

const skills = [
  {
    name: "Soul Pact",
    imgSrc:
      "https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png",
    multiplier: {
      hp: "-10",
      mp: "-10",
      exp: "-10",
      gp: "0"
    }
  },
  {
    name: "Midas Touch",
    imgSrc: "http://pixeljoint.com/files/icons/goldbar.png",
    multiplier: {
      hp: "0",
      mp: "-20",
      exp: "-10",
      gp: "30"
    }
  }
];

const stats = {
  hp: 50,
  mp: 50,
  exp: 50,
  gp: 50
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
    const newStats = exportFunctions.changedStats(skills[0], stats);
    expect(newStats).toStrictEqual({
      "stats.hp": 45,
      "stats.mp": 45,
      "stats.exp": 45,
      "stats.gp": 50
    });
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
