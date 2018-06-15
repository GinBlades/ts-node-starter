import {Db, MongoClient} from "mongodb";
import secrets from "./secretLoader";

interface IDbState {
    client: MongoClient | null,
    db: Db | null
}

const state: IDbState = {
    client: null,
    db: null
}

export let connect = async (url: string): Promise<void> => {
    if (state.db) {
        return null;
    }

    const client = await MongoClient.connect(url);
    state.client = client;
    state.db = client.db("tsNodeStarter");

    return null;
}

export let get = () => {
    return state.db;
}

export let close = (done: Function) => {
    if (state.db) {
        state.client.close((err, result) => {
            state.db = null;
            done(err);
        });
    }
}
