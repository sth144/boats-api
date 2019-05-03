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
            this.directRequest(req, res, this.slipsController.handleGet, (req, res, result) => {
                res.status(200).json(result);
            });
        });

        this.slipsRouter.post("/", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.directRequest(req, res, this.slipsController.handlePost, (req, res, result) => {
                res.status(201).send(`{ "id": ${result.id} }`);
            });
        });

        this.slipsRouter.put("/:slip_id/boats/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.slipsController.handlePut, (req, res, result) => {
                res.status(200).end();
            });
        });

        this.slipsRouter.patch("/:slip_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.slipsController.handlePatch, (req, res, result) => {
                res.status(200).end();
            });
        });

        this.slipsRouter.delete("/:slip_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.slipsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });

        this.slipsRouter.delete("/:slip_id/boats/:boat_id", async (req, res) => {
            /** undock boat from slip */
            this.directRequest(req, res, this.slipsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });
    }
}