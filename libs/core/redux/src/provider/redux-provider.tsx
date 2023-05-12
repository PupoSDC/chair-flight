import { FunctionComponent, PropsWithChildren, useState } from "react";
import { Provider } from "react-redux";
import { NoSsr } from "@mui/base";
import { PersistGate } from "redux-persist/integration/react";
import { getStoreAndPersistor } from "../store/store";

export type ReduxProviderProps = PropsWithChildren<{
  loading: React.ReactNode;
}>;

export const ReduxProvider: FunctionComponent<ReduxProviderProps> = ({
  children,
  loading,
}) => {
  const [{ store, persistor }] = useState(getStoreAndPersistor);
  return (
    <NoSsr fallback={loading}>
      <Provider store={store}>
        <PersistGate loading={loading} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </NoSsr>
  );
};
