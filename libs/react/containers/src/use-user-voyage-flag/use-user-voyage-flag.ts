import { useCallback } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type UserVoyageFlag = "has-seen-alpha-warning";

type UserVoyageZustandStore = {
  data: Record<UserVoyageFlag, boolean>;
  setData: (key: UserVoyageFlag, val: boolean) => void;
  getData: (key: UserVoyageFlag) => boolean;
};

const useUserVoyageZustand = create<UserVoyageZustandStore>()(
  devtools(
    persist(
      (set, get) => ({
        data: {
          "has-seen-alpha-warning": false,
        },
        setData: (key: UserVoyageFlag, val: boolean) =>
          set((state) => ({
            data: { ...state.data, [key]: val },
          })),
        getData: (key: UserVoyageFlag) => get().data[key] ?? false,
      }),
      { name: "user-voyage" },
    ),
  ),
);

export const useUserVoyageFlag = (
  flag: UserVoyageFlag,
): [boolean, (v: boolean) => void, () => boolean] => {
  const value = useUserVoyageZustand((state) => state.data[flag] ?? false);
  const setData = useUserVoyageZustand((state) => state.setData);
  const getData = useUserVoyageZustand((state) => state.getData);
  const set = useCallback((v: boolean) => setData(flag, v), [setData, flag]);
  const get = useCallback(() => getData(flag), [getData, flag]);
  return [value, set, get];
};
