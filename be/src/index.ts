import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { config } from "./utils/config.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { limiterMiddleware } from "./middlewares/rate-limit.js";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { createSocketServer } from "./sockets/server.js";
import { initSocket } from "./sockets/conn.js";


const __dirname = new URL(".", import.meta.url).pathname;

const app = express();
const httpServer = createServer(app);

createSocketServer(httpServer);
initSocket();

app.use(
    "/static",
    express.static(path.join(__dirname, "public"))
);

app.use(cookieParser());
app.use(corsMiddleware);
app.use(limiterMiddleware);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/api/v1", routes);

app.use(errorHandler);

httpServer.listen(config.port, () => {
    console.log(`Circle app backend service is running on ${config.host}:${config.port}...`);
});
