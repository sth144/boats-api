import * as Express from "express";
import { BoatsController } from "../controllers/boats.controller";

const controller = new BoatsController();

boatsRouter.get("/", (req, res) => {
    console.log("get boats");

    //
});

boatsRouter.post("/", (req, res) => {
    console.log("post boats");

    //
});

boatsRouter.put("/", (req, res) => {
    console.log("put boats");

    //
});

boatsRouter.patch("/", (req, res) => {
    console.log("patch boats");

    //
});

boatsRouter.delete("/", (req, res) => {
    console.log("delete boats");

    //
});

export var boatsRouter = Express.Router();