import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "../contexts/UserContext.jsx";
import { SocketProvider } from "../contexts/SocketContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <SocketProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </SocketProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);