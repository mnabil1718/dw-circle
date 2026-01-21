import { Socket, io } from "socket.io-client"


export const socket: Socket = io('http://localhost:8080', {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
});