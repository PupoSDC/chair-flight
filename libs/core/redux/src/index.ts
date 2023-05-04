import * as testActions from "./actions/test-actions";
import * as testMakerActions from "./actions/test-maker-actions";
import * as userVoyageActions from "./actions/user-voyage-actions";
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
  ...testMakerActions,
  ...userVoyageActions,
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
