import { getRandomGenerator } from "./get-random-generator.ts";

export const getRandomShuffler = (seed: string) => {
  const random = getRandomGenerator(seed);
  return <T>(items: T[]) =>
    items
      .map((item) => ({ item, order: random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item);
};
