import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App/App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css"

localStorage.debug = "mern:*";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
