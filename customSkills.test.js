import exportFuctions from "./customSkills";

//putStats = jest.fn(() => {});
exportFuctions.getStats = jest.fn(() => {
  console.log("GetStats mock function");
  return {
    "stats.hp": 50,
    "stats.mp": 50,
    "stats.exp": 50,
    "stats.gp": 50
  };
});

test("test", () => {
  exportFuctions.main();
  expect(exportFuctions.getStats).toHaveBeenCalled();
  expect;

  //console.log(customSkills);
});
