import * as testActions from "./actions/test-actions";
import { useTestHotkeys } from "./hooks/use-test-hotkeys";
import { useUserVoyageFlag } from "./hooks/use-user-voyage-flag";
import { ReduxProvider } from "./provider/redux-provider";
import {
  store,
  useAppDispatch,
  useAppSelector,
  persistor,
} from "./store/store";

const actions = {
  ...testActions,
};

export {
  store,
  persistor,
  actions,
  ReduxProvider,
  useAppDispatch,
  useAppSelector,
  useTestHotkeys,
  useUserVoyageFlag,
};
