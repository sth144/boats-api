import * as Express from "express";
import { BoatsRouterWrapper } from "@routes/boats.routes";
import { SlipsRouterWrapper } from "@routes/slips.routes";
import { IRequest } from "@lib/request.interface";
import { ErrorTypes, IError } from "@lib/error.interface";
import { CargoRouterWrapper } from "./cargo.routes";

/**
 * set API url dynamically
 */
let _URL = "http://localhost:8080";
if (process.env.GOOGLE_CLOUD_PROJECT == "hindss-boats") {
    _URL = "https://hindss-boats.appspot.com"
}
export const API_URL = _URL;

/** instantiate the router */
export const router: Express.Router = Express.Router();

/** attach error callbacks to subrouters */
BoatsRouterWrapper.Instance.attachErrorCallback(_errorHandler);
SlipsRouterWrapper.Instance.attachErrorCallback(_errorHandler);

/** hook up the routers */
router.use("/boats", BoatsRouterWrapper.Instance.boatsRouter);
router.use("/slips", SlipsRouterWrapper.Instance.slipsRouter);
router.use("/cargo", CargoRouterWrapper.Instance.cargoRouter);

/**
 * generic error handler
 * @param err error object (conforms to IError interface)
 * @param req the request object
 * @param res response object reference
 */
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