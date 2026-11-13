const ID_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const getRandomId = (random: () => number = Math.random) =>
  Array.from({ length: 8 }, () =>
    ID_CHARS.charAt(Math.floor(random() * ID_CHARS.length)),
  ).join("");
