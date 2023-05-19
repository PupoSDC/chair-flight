import { FunctionComponent, PropsWithChildren, useState } from "react";
import { Provider } from "react-redux";
import { NoSsr } from "@mui/base";
import { PersistGate } from "redux-persist/integration/react";
import { getStoreAndPersistor } from "../store/store";

export type ReduxProviderProps = PropsWithChildren<{
  loading: React.ReactNode;
}>;

const ReduxProviderClientOnly: FunctionComponent<ReduxProviderProps> = ({
  loading,
  children,
}) => {
  const [{ store, persistor }] = useState(getStoreAndPersistor);
  return (
    <Provider store={store}>
      <PersistGate loading={loading} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export const ReduxProvider: FunctionComponent<ReduxProviderProps> = (props) => (
  <NoSsr fallback={props.loading}>
    <ReduxProviderClientOnly {...props} />
  </NoSsr>
);
