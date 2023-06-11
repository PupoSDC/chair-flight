import { useDispatch, useSelector, useStore } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import { default as createWebStorage } from "redux-persist/lib/storage/createWebStorage";
import { questionEditorReducer } from "../reducers/question-editor-reducer";
import { testMakerReducer } from "../reducers/test-maker-reducer";
import { testProgressReducer } from "../reducers/test-progress-reducer";
import { userVoyageReducer } from "../reducers/user-voyage-reducer";
import type { TypedUseSelectorHook } from "react-redux";

export const getStoreAndPersistor = () => {
  const combinedReducer = combineReducers({
    testProgress: testProgressReducer,
    userVoyage: userVoyageReducer,
    testMaker: testMakerReducer,
    questionEditor: questionEditorReducer,
  });

  const storage = createWebStorage("local");

  const persistedReducer = persistReducer(
    {
      key: "root",
      version: 1,
      storage,
    },
    combinedReducer
  );

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

type Store = ReturnType<typeof getStoreAndPersistor>["store"];
type RootState = ReturnType<Store["getState"]>;
type AppDispatch = Store["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();
