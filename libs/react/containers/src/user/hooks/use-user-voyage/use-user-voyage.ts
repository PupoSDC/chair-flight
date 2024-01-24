import { useCallback } from "react";
import { z } from "zod";
import { createUsePersistenceHook } from "../../../hooks/use-persistence";

const userVoyageSchema = z.object({
  lastBlogVisit: z.string().datetime().default("2020-01-01T00:00:00.000Z"),
});

const defaultValues = userVoyageSchema.parse({});

type UserVoyage = z.infer<typeof userVoyageSchema>;
type SetUserVoyage = (obj: Partial<UserVoyage>) => void;
type UseUserVoyage = {
  (): [UserVoyage, SetUserVoyage];
  markBlogAsVisited: () => void;
};

const useUserVoyagesPersistence = createUsePersistenceHook(
  "cf-user-voyage",
  defaultValues,
);

export const useUserVoyage: UseUserVoyage = () => {
  const { data, getData, setData } = useUserVoyagesPersistence();

  const setUserVoyage: SetUserVoyage = useCallback(
    (newData) => {
      setData({ ...defaultValues, ...getData(), ...newData });
    },
    [setData, getData],
  );

  return [data, setUserVoyage];
};

useUserVoyage.markBlogAsVisited = () => {
  useUserVoyagesPersistence.state.setState({
    data: {
      lastBlogVisit: new Date().toISOString(),
    },
  });
};
