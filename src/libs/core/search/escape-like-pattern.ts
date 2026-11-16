export const escapeLikePattern = (value: string) =>
  value.replace(/[\\%_]/g, "\\$&");
