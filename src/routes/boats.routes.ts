import * as Express from "express";
import { BoatsController } from "@controllers/boats.controller";
import { isError, ErrorTypes, IError } from "@lib/error.interface";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";

// TODO: implement routes involving cargo
export class BoatsRouterWrapper extends RouterWrapper {
    /**
     * singleton
     */
    private static _instance: BoatsRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new BoatsRouterWrapper();
        return this._instance;
    }

    public boatsRouter: Express.Router; 
    private boatsController: BoatsController;

    private constructor() {
        super();
        this.boatsRouter = Express.Router();
        this.boatsController = new BoatsController();
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.boatsRouter.get("/(:boat_id)?", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.boatsController.handleGet(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result, req, res);
                } else {
                    /** send response */ 
                    res.status(200).json(result);
                }
            });
        });
    
        this.boatsRouter.post("/", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.boatsController.handlePost(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result, req, res);
                } else {
                    let key = result;
                    /** send response */ 
                    res.status(201).send(`{ "id": ${key.id} }`);
                }
            });
        });
    
        this.boatsRouter.patch("/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.boatsController.handlePatch(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result as IError, req, res)
                } else {
                    res.status(200).end();
                }
            });
        });
    
        this.boatsRouter.delete("/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.boatsController.handleDelete(req).then((result) => {
                if (isError(result)) {
                    this.handleError(result as IError, req, res);
                } else {
                    res.status(204).end();
                }
            });
        });
    }    
}
