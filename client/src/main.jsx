import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";

import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>,
  );
}
