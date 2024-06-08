import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import Router from "router/router";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Router />
    <ToastContainer position="bottom-right" autoClose={3000} newestOnTop />
  </React.StrictMode>,
);

reportWebVitals();
