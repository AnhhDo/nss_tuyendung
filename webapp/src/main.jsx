import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { initAuthTokenStore } from "./services/authTokenStore.jsx";

const root = createRoot(document.getElementById("root"));

initAuthTokenStore()
  .catch((e) => {
    console.error("initAuthTokenStore failed:", e);
  })
  .finally(() => {
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    );
  });