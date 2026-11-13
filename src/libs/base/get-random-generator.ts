const createSfc32 = (a: number, b: number, c: number, d: number) => {
  const state = { a, b, c, d };
  return () => {
    const t = (((state.a + state.b) | 0) + ((state.d + 1) | 0)) | 0;
    state.d = (state.d + 1) | 0;
    state.a = state.b ^ (state.b >>> 9);
    state.b = (state.c + (state.c << 3)) | 0;
    state.c = (((state.c << 21) | (state.c >>> 11)) + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export const getRandomGenerator = (seed: string) => {
  const state = {
    h: Array.from(seed).reduce((h, char) => {
      const mixed = Math.imul(h ^ char.charCodeAt(0), 3432918353);
      return (mixed << 13) | (mixed >>> 19);
    }, 1779033703 ^ seed.length),
  };
  const seedNext = () => {
    state.h = Math.imul(state.h ^ (state.h >>> 16), 2246822507);
    state.h = Math.imul(state.h ^ (state.h >>> 13), 3266489909);
    state.h ^= state.h >>> 16;
    return state.h >>> 0;
  };
  return createSfc32(seedNext(), seedNext(), seedNext(), seedNext());
};
