import { NoSsr } from "@mui/base";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../store/store";
import type { FunctionComponent, PropsWithChildren } from "react";

export type ReduxProviderProps = PropsWithChildren<{
  loading: React.ReactNode;
}>;

export const ReduxProvider: FunctionComponent<ReduxProviderProps> = ({
  children,
  loading,
}) => (
  <NoSsr fallback={loading}>
    <Provider store={store}>
      <PersistGate loading={loading} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  </NoSsr>
);
