import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "../contexts/UserContext.jsx";
import { SocketProvider } from "../contexts/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </SocketProvider>
  </AuthProvider>
);