import { io } from "socket.io-client";

// Connect to the backend namespaces
export const notificationsSocket = io("/notifications", {
  transports: ["websocket"], // Ensure WS for speed
});

export const queueSocket = io("/api/queue", {
  transports: ["websocket"],
});
