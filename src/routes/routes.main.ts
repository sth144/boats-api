import * as Express from "express";
import { BoatsRouterWrapper } from "@routes/boats.routes";
import { SlipsRouterWrapper } from "@routes/slips.routes";
import { IRequest } from "@lib/request.interface";
import { ErrorTypes, IError } from "@lib/error.interface";

// TODO: set API_URL dynamically
export const API_URL = "http://localhost:8080"; //process.env.get();

export const router: Express.Router = Express.Router();

BoatsRouterWrapper.Instance.attachErrorCallback(_errorHandler);
SlipsRouterWrapper.Instance.attachErrorCallback(_errorHandler);

router.use("/boats", BoatsRouterWrapper.Instance.boatsRouter);
router.use("/slips", SlipsRouterWrapper.Instance.slipsRouter);

async function _errorHandler(err: IError, req: IRequest, res): Promise<void> {
    switch(err.error_type) {
        case ErrorTypes.BAD_EDIT: {
            res.status(406).end();
        } break;
        case ErrorTypes.NOT_FOUND: {
            res.status(404).end();
        } break;
        case ErrorTypes.INTERFACE: {
            res.status(400).end();
        } break;
        case ErrorTypes.NO_ID: {
            res.status(400).end();
        } break;
        case ErrorTypes.NOT_UNIQUE: {
            res.status(403).end();
        } break;
        case ErrorTypes.FORBIDDEN: {
            res.status(403).end();
        } break;
        default: ;
    }
}