import * as Express from "express";
import { BoatsRouterWrapper } from "@routes/boats.routes";
import { SlipsRouterWrapper } from "@routes/slips.routes";

export const router: Express.Router = Express.Router();

router.use("/boats", BoatsRouterWrapper.Instance.boatsRouter);
router.use("/slips", SlipsRouterWrapper.Instance.slipsRouter);