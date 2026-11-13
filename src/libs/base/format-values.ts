export const formatMillisecondsAsClock = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};

export const formatEpochAsDate = (epochMs: number) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(epochMs);

export const formatIsoDateAsDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(
    new Date(isoDate),
  );

export const formatSlugAsTitle = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
