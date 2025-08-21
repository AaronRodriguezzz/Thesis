import { io } from "socket.io-client";
const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4001' : 'https://tototumbs.onrender.com';

// Connect to the backend namespaces
export const notificationsSocket = io(`${baseUrl}/notifications`, {
  transports: ["websocket"], // Ensure WS for speed
});

export const queueSocket = io(`${baseUrl}/queue`, {
  transports: ["websocket"],
});
