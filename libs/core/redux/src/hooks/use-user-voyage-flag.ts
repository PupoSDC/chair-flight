import { useCallback } from "react";
import { setUserVoyageFlag } from "../actions/user-voyage-actions";
import { useAppDispatch, useAppSelector } from "../store/store";
import type { UserVoyageFlag } from "../actions/user-voyage-actions";

export const useUserVoyageFlag = (
  flag: UserVoyageFlag
): [boolean, (v: boolean) => void] => {
  const value = useAppSelector((s) => s.userVoyage.flags[flag]) ?? false;
  const dispatch = useAppDispatch();
  const callback = useCallback(
    (v: boolean) => {
      dispatch(setUserVoyageFlag({ flag, value: v }));
    },
    [dispatch]
  );

  return [value, callback];
};
