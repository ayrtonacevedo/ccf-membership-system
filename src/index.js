import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode> comente para que no me haga dos veces todo
  <App />
  //</React.StrictMode>
);
