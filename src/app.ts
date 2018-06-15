import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import httpErrors from "http-errors";

import indexRouter from "./router/index";

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "pug");

app.use(cors({
    origin: "*"
}));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    next(httpErrors(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).send("Something broke");
})

export default app;
