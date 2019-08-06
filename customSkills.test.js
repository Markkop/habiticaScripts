import exportFuctions from "./customSkills";

exportFuctions.getStats = jest.fn(() => {
  //console.log("GetStats mock function");
  return {
    "stats.hp": 50,
    "stats.mp": 50,
    "stats.exp": 50,
    "stats.gp": 50
  };
});

describe("createButtons", () => {
  it("creates two buttons", () => {
    const skills = [
      {
        name: "Skill1",
        changeHp: "-10"
      },
      {
        name: "Skill2",
        changeHp: "-20"
      }
    ];
    const stats = exportFuctions.getStats();
    expect(exportFuctions.getStats).toHaveBeenCalled();

    expect(exportFuctions.createButtons(skills, stats)).toBeDefined();
    expect(exportFuctions.createButtons(skills, stats)).toHaveLength(2);
  });

  it("it throws an error if no inputs are provided", () => {
    expect(() => {
      exportFuctions.createButtons();
    }).toThrow();
  });
});
