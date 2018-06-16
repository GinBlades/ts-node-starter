import httpErrors, { HttpError } from "http-errors";
import { ObjectID } from "mongodb";

import {get as getDb} from "./db";

export const coll = async (collectionName: string) => {
    const db = await getDb();
    return db.collection(collectionName);
}

export interface RecordResult {
    error: HttpError | null,
    payload: any
}

export const objId = (id: string) => {
    return new ObjectID(id);
}

export const setRecord = async (collectionName: string, id: string): Promise<RecordResult> => {
    const oid = objId(id);
    const collection = await coll(collectionName);
    const tmpDemo = await collection.findOne({_id: oid});

    if (null == tmpDemo) {
        return {
            error: httpErrors(404, `tmpDemo not found for id: ${id}`),
            payload: null
        };
    }

    return {
        error: null,
        payload: tmpDemo
    };
}
