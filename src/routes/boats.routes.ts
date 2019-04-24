import * as Express from "express";
import { BoatsController } from "@controllers/boats.controller";

const controller = new BoatsController();

export const boatsRouter = Express.Router();

boatsRouter.get("/", async (req, res) => {
    console.log("get boats");

    let result = await controller.handleGet(req);

    /** compute response */

    /** send response */ 

    res.status(200).end();
});

boatsRouter.post("/", async (req, res) => {
    console.log("post boats");

    let result = await controller.handlePost(req);
    console.log("done handling post");
    /** compute response */

    /** send response */ 
    res.status(200).end();
});

boatsRouter.put("/", async (req, res) => {
    console.log("put boats");

    let result = await controller.handlePut(req);

    /** compute response */

    /** send response */ 
});

boatsRouter.patch("/", async (req, res) => {
    console.log("patch boats");

    let result = await controller.handlePatch(req);

    /** compute response */

    /** send response */ 
});

boatsRouter.delete("/", async (req, res) => {
    console.log("delete boats");

    let result = await controller.handleDelete(req);

    /** compute response */

    /** send response */ 
});
