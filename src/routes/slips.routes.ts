import * as Express from "express";
import { SlipsController } from "../controllers/slips.controller";

const controller = new SlipsController();

slipsRouter.get("/", (req, res) => {
    console.log("get slips");

    //
});

slipsRouter.post("/", (req, res) => {
    console.log("post slips");

    //
});

slipsRouter.put("/", (req, res) => {
    console.log("put slips");

    //
});

slipsRouter.patch("/", (req, res) => {
    console.log("patch slips");

    //
});

slipsRouter.delete("/", (req, res) => {
    console.log("delete slips");

    //
});

export var slipsRouter = Express.Router();