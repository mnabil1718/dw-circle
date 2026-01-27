import type { Server as HTTPServer } from "http";
import { config } from "../utils/config.js";
import { Server } from "socket.io";

// global singleton server object
let io: Server | null = null;

export function createSocketServer(httpServer: HTTPServer): void {
    io = new Server(httpServer, {
        cors: {
            origin: config.frontend_url,
        }
    });
}

export function getSocketServer(): Server {
    if (!io) {
        throw new Error("socket server is not found");
    }

    return io;
}



