import {Router} from "express";
import { ObjectID } from "mongodb";
import httpErrors, { HttpError } from "http-errors";

import {get as getDb} from "../db";
import TmpDemo from "../models/tmpDemo";
import * as RU from "../routeUtilities";

const router = Router();
const collectionName = "tmpDemo";

router.get("/", async (req, res) => {
    const collection = await RU.coll(collectionName);
    const tmpDemos = await collection.find({}).toArray();
    res.render("tmpDemo/index", {
        tmpDemos: tmpDemos
    });
});

router.get("/new", (req, res) => {
    res.render("tmpDemo/new");
});

router.get("/:id", async (req, res, next) => {
    const result = await RU.setRecord(collectionName, req.params.id);
    if (null != result.error) {
        return next(result.error);
    }
    res.render("tmpDemo/show", {
        tmpDemo: result.payload
    });
});

router.post("/", async (req, res) => {
    const tmpDemo = TmpDemo.init(req.body.firstName, req.body.lastName,req.body.position);
    const collection = await RU.coll(collectionName);
    collection.insertOne(tmpDemo.normalize());
    res.redirect("/tmp-demo");
});

router.get("/:id/edit", async (req, res, next) => {
    const result = await RU.setRecord(collectionName, req.params.id);
    if (null != result.error) {
        return next(result.error);
    }
    res.render("tmpDemo/edit", {
        tmpDemo: result.payload
    });

});

router.post("/:id", async (req, res, next) => {
    const collection = await RU.coll(collectionName);
    const updateObj = TmpDemo.handleUpdateRequest(req);
    const result = await collection.updateOne({_id: RU.objId(req.params.id)}, {
        $set: updateObj
    });
    if (1 === result.result.ok) {
        res.redirect(`/tmp-demo/${req.params.id}`);
    } else {
        console.log(result);
        next(httpErrors(500, "Update result failed."));
    }
});

router.post("/:id/delete", async (req, res, next) => {
    const collection = await RU.coll(collectionName);
    const result = await collection.deleteOne({_id: RU.objId(req.params.id)});
    if (1 === result.result.ok) {
        res.redirect("/tmp-demo");
    } else {
        console.log(result);
        next(httpErrors(500, "Delete operation failed."));
    }
});

export default router;
