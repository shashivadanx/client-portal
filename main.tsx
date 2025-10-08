import "@/style/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app";
import Provider from "./src/providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>
);
