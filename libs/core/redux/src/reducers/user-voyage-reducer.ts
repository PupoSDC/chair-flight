import { createReducer } from "@reduxjs/toolkit";
import { setUserVoyageFlag } from "../actions/user-voyage-actions";
import type { UserVoyageFlag } from "../actions/user-voyage-actions";

export type UserVoyageReducer = {
  flags: Partial<Record<UserVoyageFlag, boolean>>;
};

export const userVoyageReducer = createReducer<UserVoyageReducer>(
  {
    flags: {},
  },
  (builder) => {
    builder.addCase(setUserVoyageFlag, (store, action) => {
      const { flag, value } = action.payload;
      store.flags[flag] = value;
    });
  }
);
