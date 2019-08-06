import { main } from "./customSkills";

jest.mock({
  // The line below allows to mock only some functions
  getStats: jest.fn(() => ({
    hp: 50
  })),
  hey: jest.fn(() => "rua"),
  putStats: jest.fn(() => {}),
  fetch: jest.fn(() => {})
});

//const { main } = jest.requireActual("./customSkills.js");

test("test", () => {
  const stats = {
    "stats.hp": 50,
    "stats.mp": 50,
    "stats.exp": 50,
    "stats.gp": 50
  };
  main();
  console.log(customSkills);
});
