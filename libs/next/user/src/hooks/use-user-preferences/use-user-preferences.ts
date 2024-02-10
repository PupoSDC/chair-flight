import { useCallback } from "react";
import { z } from "zod";
import { createUsePersistenceHook } from "@chair-flight/react/components";

const userPreferencesSchema = z.object({
  examModeAutoSkip: z.boolean().default(false),
  studyModeAutoSkip: z.boolean().default(false),
  sortQuestionsByChapter: z.boolean().default(false),
});

const defaultValues = userPreferencesSchema.parse({});

type UserPreferences = z.infer<typeof userPreferencesSchema>;
type SetUserPreferences = (obj: Partial<UserPreferences>) => void;

const useUserPreferencesPersistence = createUsePersistenceHook(
  `cf-user-preferences`,
  defaultValues,
);

export const useUserPreferences = (): [UserPreferences, SetUserPreferences] => {
  const { data, getData, setData } = useUserPreferencesPersistence();

  const setUserPreference: SetUserPreferences = useCallback(
    (newData) => {
      setData({ ...defaultValues, ...getData(), ...newData });
    },
    [setData, getData],
  );

  return [data, setUserPreference];
};

export const userPreferences = useUserPreferencesPersistence.state;
