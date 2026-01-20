import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { config } from "./utils/config.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { limiterMiddleware } from "./middlewares/rate-limit.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(corsMiddleware);
app.use(limiterMiddleware);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Circle app backend service is running on ${config.host}:${config.port}...`);
});
