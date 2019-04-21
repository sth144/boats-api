import * as Express from "express";
export var router = Express.Router();

import { boatsRouter } from "./boats.routes";
import { slipsRouter } from "./slips.routes";

router.use("boats/", boatsRouter);
router.use("slips/", slipsRouter);