import { getSocketServer } from "./server.js";

export function initSocket() {
    const io = getSocketServer();
    io.on("connection", (socket) => {
        console.log("client connected...");

        socket.on("disconnect", () => {
            console.log("client disconnected...");
        });
    });
}
