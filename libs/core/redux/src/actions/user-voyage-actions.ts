import { createAction } from "@reduxjs/toolkit";

export type UserVoyageFlag = "has-seen-alpha-warning";

export const setUserVoyageFlag = createAction<{
  flag: UserVoyageFlag;
  value: boolean;
}>("user-voyage/set-flag");
