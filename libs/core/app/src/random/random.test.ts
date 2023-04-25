import { getRandomIdGenerator, getRandomShuffler } from "./random";

describe("getRandomShuffler", () => {
  it("is idempotent", () => {
    const arrayWith100Numbers = Array.from(Array(100).keys());
    const shuffler1 = getRandomShuffler("seed");
    const shuffler2 = getRandomShuffler("seed");
    expect(shuffler1(arrayWith100Numbers)).toEqual(
      shuffler2(arrayWith100Numbers)
    );
  });
});

describe("getRandomIdGenerator", () => {
  it("is idempotent", () => {
    const gen1 = getRandomIdGenerator("seed");
    const gen2 = getRandomIdGenerator("seed");
    expect(gen1()).toEqual(gen2());
  });
});
