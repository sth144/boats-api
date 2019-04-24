import * as Express from "express";
import { SlipsController } from "@controllers/slips.controller";
import { isError, ErrorTypes } from "@lib/error.interface";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";

export class SlipsRouterWrapper extends RouterWrapper {
    /**
     * singleton
     */
    private static _instance: SlipsRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new SlipsRouterWrapper();
        return this._instance;
    }

    public slipsRouter: Express.Router;
    private slipsController: SlipsController;

    private constructor() {
        super();
        this.slipsRouter = Express.Router();
        this.slipsController = new SlipsController();
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.slipsRouter.get("/(:slip_id)?", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.slipsController.handleGet(req).then((result) => {
                /** send response */ 
                res.status(200).json(result);
            });
        });

        this.slipsRouter.post("/", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.slipsController.handlePost(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result, req, res)
                } else {
                    let key = result;
                    /** send response */ 
                    res.status(200).send(`{ "id": ${key.id} }`);
                }
            })
        });

        this.slipsRouter.put("/:slip_id/boats/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.slipsController.handlePut(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result, req, res);
                } else {
                    res.status(200).end();
                }
            });
        });

        this.slipsRouter.patch("/:slip_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.slipsController.handlePatch(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result, req, res);
                } else {
                    res.status(200).end();
                }
            });
        });

        this.slipsRouter.delete("/:slip_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.slipsController.handleDelete(req).then(res.status(200).end());
        });

        this.slipsRouter.delete("/:slip_id/boats/:boat_id", async (req, res) => {
            /** undock boat from slip */
            this.slipsController.handleDelete(req).then(() => {
                // TODO: handle results here
            })
        })
    }

    protected async handleError(err, req: IRequest, res): Promise<void> {
        // TODO: handle error in router
        switch(err) {
            case ErrorTypes.BAD_EDIT: {
            
            } break;
            default: ;
        }
    }
}