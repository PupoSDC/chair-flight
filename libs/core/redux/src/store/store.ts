import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { default as storage } from "redux-persist/lib/storage";
import { testsReducer } from "../reducers/tests-reducer";
import { userPreferencesReducer } from "../reducers/user-preferences-reducer";
import { userVoyageReducer } from "../reducers/user-voyage-reducer";
import type { TypedUseSelectorHook } from "react-redux";

const combinedReducer = combineReducers({
  tests: testsReducer,
  userVoyage: userVoyageReducer,
  userPreferences: userPreferencesReducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version: 1,
    storage,
  },
  combinedReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
