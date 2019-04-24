import * as Express from "express";
import { boatsRouter } from "./boats.routes";
import { slipsRouter } from "./slips.routes";

export const router = Express.Router();

router.use("/boats", boatsRouter);
router.use("/slips", slipsRouter);