import * as testActions from "./actions/test-actions";
import { useTestHotkeys } from "./hooks/use-test-hotkeys";
import { ReduxProvider } from "./provider/redux-provider";
import { useAppDispatch, useAppSelector } from "./store/store";

const actions = {
  ...testActions,
};

export {
  actions,
  ReduxProvider,
  useAppDispatch,
  useAppSelector,
  useTestHotkeys,
};
