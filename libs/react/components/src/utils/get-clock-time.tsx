export const getClockTime = (timeInSeconds: number) => {
  const time = Math.round(timeInSeconds);
  return `${Math.floor(time / 60)}:${("0" + (time % 60)).slice(-2, 3)}`;
};
