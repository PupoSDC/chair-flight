const sfc32 = (a: number, b: number, c: number, d: number) => {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export const getRandomGenerator = (seed: string): (() => number) => {
  let i = 0;
  let h = 1779033703 ^ seed.length;
  for (; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  const seeder = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };

  return sfc32(seeder(), seeder(), seeder(), seeder());
};

export const getRandomShuffler = (seed: string): (<T>(arr: T[]) => T[]) => {
  const random = getRandomGenerator(seed);
  const shuffleFn = () => random() - 0.5;
  return (arr) => [...arr].sort(shuffleFn);
};

export const getRandomIdGenerator = (seed: string) => {
  const LENGTH = 8;
  const VALID_CHARS =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const random = getRandomGenerator(seed);
  return () => {
    let uid = "";
    for (let i = 0; i < LENGTH; i++) {
      uid = uid + VALID_CHARS[Math.floor(random() * VALID_CHARS.length)];
    }
    return uid;
  };
};

export const getRandomId = getRandomIdGenerator(Math.random().toString());
