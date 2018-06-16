import {Router} from "express";
import httpErrors from "http-errors";
import * as RU from "../../routeUtilities";
import TmpDemo from "../../models/tmpDemo";

const router = Router();
const collectionName = "tmpDemo";

router.get("/", async (req, res) => {
    const collection = await RU.coll(collectionName);
    const tmpDemos = await collection.find({}).toArray();
    const serialized = tmpDemos.map((demo) => {
        return TmpDemo.fromObj(demo).normalize();
    })
    res.json({tmpDemos: serialized});
});

router.get("/:id", async (req, res, next) => {
    const result = await RU.setRecord(collectionName, req.params.id);
    if (null != result.error) {
        return next(result.error);
    }
    res.json(TmpDemo.fromObj(result.payload).normalize());
});

router.post("/", async (req, res) => {
    const tmpDemo = TmpDemo.init(req.body.firstName, req.body.lastName,req.body.position);
    const collection = await RU.coll(collectionName);
    const result = await collection.insertOne(tmpDemo.normalize());
    tmpDemo._id = result.insertedId;
    res.json(tmpDemo.normalize());
});

router.put("/:id", async (req, res, next) => {
    const collection = await RU.coll(collectionName);
    const updateObj = TmpDemo.handleUpdateRequest(req);
    const result = await collection.findOneAndUpdate({_id: RU.objId}, {
        $set: updateObj
    }, { returnOriginal: false });
    if (1 === result.ok) {
        res.json(result.value);
    } else {
        console.log(result);
        next(httpErrors(500, "Update failed."));
    }
});

router.delete("/:id", async (req, res, next) => {
    const collection = await RU.coll(collectionName);
    const deleteResult = await collection.deleteOne({_id: RU.objId});
    if (1 === deleteResult.result.ok) {
        res.json({});
    } else {
        console.log(deleteResult);
        next(httpErrors(500, "Delete failed."));
    }
});

export default router;
