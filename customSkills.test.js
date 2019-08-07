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
        name: "Soul Pact",
        imgSrc:
          "https://www.pngix.com/pngfile/middle/48-486388_spell-book-icon-spellbook-icon-hd-png-download.png",
        multiplier: {
          hp: "-10",
          mp: "+10",
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
          gp: "0"
        }
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
