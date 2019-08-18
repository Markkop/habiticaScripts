import exportFunctions from "./customSkills";

//Mocked functions
exportFunctions.putStats = jest.fn(() => {});
exportFunctions.getStats = jest.fn(() => stats);
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
      gp: "10M"
    }
  },
  {
    name: "High Cost",
    imgSrc: "http://pixeljoint.com/files/icons/goldbar.png",
    statsChange: {
      hp: "-98M",
      mp: "10",
      exp: "0",
      gp: "-10"
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

  it("clicks", async () => {
    const buttons = exportFunctions.createButtons(skills, stats);
    buttons[0].click();
    expect(await exportFunctions.getStats).toHaveBeenCalled();
    expect(await exportFunctions.putStats).toHaveBeenCalled();
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
      "stats.gp": 55
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

  it("throws an error with wrong skill object", () => {
    const wrongMpStat = exportFunctions.changeStats(
      { statsChange: { hp: "-50M", sp: "30" } },
      stats
    );
    expect(wrongMpStat).toStrictEqual({
      "stats.hp": 5,
      "stats.mp": 40,
      "stats.exp": 50,
      "stats.gp": 50
    });
    expect(exportFunctions.changeStats).toThrow();

    const wrongObject = exportFunctions.changeStats(
      { statsChange: { nothing: "at all" } },
      stats
    );
    expect(wrongObject).toStrictEqual({
      "stats.hp": stats.hp,
      "stats.mp": stats.mp,
      "stats.exp": stats.exp,
      "stats.gp": stats.gp
    });
    expect(exportFunctions.changeStats).toThrow();
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
  it("throws error if didn't find spell container", () => {
    const buttons = exportFunctions.createButtons(skills, stats);
    const newSkillsDiv = exportFunctions.appendSkills(buttons);
    expect(newSkillsDiv).toStrictEqual([]);
  });

  it("appends the right number of buttons", () => {
    const spellContainer = document.createElement("div");
    spellContainer.className = "container spell-container";
    document.body.appendChild(spellContainer);

    const buttons = exportFunctions.createButtons(skills, stats);
    const newSkillsDiv = exportFunctions.appendSkills(buttons);
    expect(newSkillsDiv).toHaveLength(3);
  });
});

describe("selectMaxValues", () => {
  it("gets right strings", () => {
    const hp = exportFunctions.selectMaxValues("hp");
    expect(hp).toBe("maxHealth");
    const mp = exportFunctions.selectMaxValues("mp");
    expect(mp).toBe("maxMP");
    const exp = exportFunctions.selectMaxValues("exp");
    expect(exp).toBe("toNextLevel");
    const gp = exportFunctions.selectMaxValues("gp");
    expect(gp).toBe("gp");
  });

  it("fails if wrong input", () => {
    const error = exportFunctions.selectMaxValues("asdfgr");
    expect(error).toBe("error");
  });
});

describe("main", () => {
  it("runs with mockup", async () => {
    exportFunctions.main();
    expect(await exportFunctions.getStats).toHaveBeenCalled();
  });
});
