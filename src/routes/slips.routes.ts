import * as Express from "express";
import { SlipsController } from "@controllers/slips.controller";

const controller = new SlipsController();

export const slipsRouter = Express.Router();

slipsRouter.get("/", async (req, res) => {
    console.log("get slips");

    let result = await controller.handleGet(req);

    /** compute response */

    /** send response */ 
    res.status(200).end();
});

slipsRouter.post("/", async (req, res) => {
    console.log("post slips");

    let result = await controller.handlePost(req);

    /** compute response */

    /** send response */ 
});

slipsRouter.put("/", async (req, res) => {
    console.log("put slips");

    let result = await controller.handlePut(req);

    /** compute response */

    /** send response */ 
});

slipsRouter.patch("/", async (req, res) => {
    console.log("patch slips");

    let result = await controller.handlePatch(req);

    /** compute response */

    /** send response */ 
});

slipsRouter.delete("/", async (req, res) => {
    console.log("delete slips");
    
    let result = await controller.handleDelete(req);

    /** compute response */

    /** send response */ 
});