import exportFunctions from "./customSkills";

//Mocked functions
exportFunctions.putStats = jest.fn(() => {});
exportFunctions.getStats = jest.fn(() => stats);

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

describe("addEvent", () => {
  it("appends skills", () => {
    const stats = {
      "stats.hp": 45,
      "stats.mp": 45,
      "stats.exp": 45,
      "stats.gp": 50
    };
    const button = document.createElement("div");
    exportFunctions.addEvent(button, exportFunctions.putStats);
    //expect(exportFunctions.getStats).toHaveBeenCalled();
    //Make button being clicked to then check the line above 
    console.log(button);
  });
});
