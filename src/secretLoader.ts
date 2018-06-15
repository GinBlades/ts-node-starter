import fs from "fs";
import path from "path";

export interface ISecrets {
    mongoConn?: string,
    redisConn?: string,
    sessionSecret?: string,
    cookieSecret?: string,
    jwtSecret?: string,
    approvedOrigins?: string,
    logLevel?: string,
    // Specify 'index signature'. Given a 'string' key it should return a 'string' or 'null'.
    [index: string]: string | null
}

let secrets: ISecrets = {};

// Default to using 'secrets.json' in root directory
try {
    const content = fs.readFileSync(path.join(__dirname, "..", "secrets.json"), "utf8");
    const data = JSON.parse(content);
    secrets = data;
} catch (err) {
    console.error(err);
}

const envVars: ISecrets = {
    mongoConn: "MONGO_CONN",
    redisConn: "REDIS_CONN",
    sessionSecret: "SESSION_SECRET",
    cookieSecret: "COOKIE_SECRET",
    jwtSecret: "JWT_SECRET",
    approvedOrigins: "APPROVED_ORIGINS",
    logLevel: "LOG_LEVEL"
}

// Overwrite anything set in the environment
for (let key in envVars) {
    if (null == process.env[envVars[key]]) {
        continue;
    }
    secrets[key] = process.env[envVars[key]];
}

export default secrets;
