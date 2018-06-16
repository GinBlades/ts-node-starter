import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import httpErrors from "http-errors";
import session from "express-session";
import connectRedis from "connect-redis";

import indexRouter from "./routes/index";
import tmpDemoRouter from "./routes/tmpDemo";
import secrets from "./secretLoader";

const app = express();
const RedisStore = connectRedis(session);
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.use(cors({
    origin: secrets.approvedOrigins
}));
app.use(logger(secrets.logLevel));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secrets.cookieSecret, {}));
app.use(session({
    store: new RedisStore({
        url: secrets.redisConn
    }),
    resave: false,
    saveUninitialized: false,
    secret: secrets.sessionSecret
}));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRouter);
app.use("/tmp-demo", tmpDemoRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(httpErrors(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).send("Something broke");
})

export default app;
