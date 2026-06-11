import { io } from "socket.io-client";

const socket = io(); // Connects to the same host/port the app is served from

export default socket;
