import React from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import App from "./App";
import initializeStore from "./store";

const Bootstrap = () => {
  const [store, setStore] = React.useState<Store>();

  React.useEffect(() => {
    const start = async () => {
      const preparedStore = await initializeStore();
      setStore(preparedStore);
    };

    start();
  }, []);
  if (!store) {
    return <></>;
  }
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Bootstrap;
