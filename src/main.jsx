import ReactDOM from "react-dom/client";
import "./reset.css";
import "./index.css";
import App from "./App";
import { store } from "./Reducer/store";
import { Provider } from "react-redux";
import { NavermapsProvider } from "react-naver-maps";

import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export let persistor = persistStore(store);

const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <App />,
    },
  ],
  {
    future: {
      v7_startTransition: false, // future 플래그 비활성화
    },
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <NavermapsProvider
      ncpClientId="hbspx7dfqb"
      // or finClientId, govClientId
    >
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </NavermapsProvider>
  </Provider>
);
