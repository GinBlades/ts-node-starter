import debug from "debug";
import http from "http";

import secrets from "./secretLoader";
import app from "./app";
import {connect as dbConnect} from "./db";

const port = process.env.PORT || "3000";
app.set("port", port);

const start = async () => {
    try{
        await dbConnect(secrets.mongoConn);

        const server = http.createServer(app);
        server.listen(port);
        server.on("listening", () => {
            debug("Listening on " + port);
        });
    } catch(err) {
        console.error(err);
    }
}

start();
