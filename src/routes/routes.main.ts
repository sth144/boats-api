import * as Express from "express";
import { BoatsRouterWrapper } from "@routes/boats.routes";
import { SlipsRouterWrapper } from "@routes/slips.routes";
import { IRequest } from "@lib/request.interface";
import { ErrorTypes, IError } from "@lib/error.interface";
import { CargoRouterWrapper } from "./cargo.routes";
import { ShipsRouterWrapper } from "./ships.routes";
import { LoginRouterWrapper } from "./login.routes";
import { SHIPS } from "@models/ships.model";
import { BOATS } from "@models/boats.model";
import { SLIPS } from "@models/slips.model";
import { CARGO } from "@models/cargo.model";


/** instantiate the router */
export const router: Express.Router = Express.Router();

/** attach error callbacks to subrouters */
ShipsRouterWrapper.Instance.attachErrorCallback(_errorHandler);
BoatsRouterWrapper.Instance.attachErrorCallback(_errorHandler);
SlipsRouterWrapper.Instance.attachErrorCallback(_errorHandler);
CargoRouterWrapper.Instance.attachErrorCallback(_errorHandler);
LoginRouterWrapper.Instance.attachErrorCallback(_errorHandler);

/** hook up the routers */
router.use(`/${SHIPS}`, ShipsRouterWrapper.Instance.shipsRouter);
router.use(`/${BOATS}`, BoatsRouterWrapper.Instance.boatsRouter);
router.use(`/${SLIPS}`, SlipsRouterWrapper.Instance.slipsRouter);
router.use(`/${CARGO}`, CargoRouterWrapper.Instance.cargoRouter);
router.use(`/login`, LoginRouterWrapper.Instance.loginRouter);

/**
 * generic error handler
 * @param err error object (conforms to IError interface)
 * @param req the request object
 * @param res response object reference
 */
async function _errorHandler(err: IError, req: IRequest, res): Promise<void> {
    switch(err.error_type) {
        case ErrorTypes.BAD_MEDIA_TYPE:
        case ErrorTypes.BAD_EDIT: {
            res.status(406).end();
        } break;
        case ErrorTypes.METHOD_NOT_ALLOWED: {
            res.status(405).end();
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