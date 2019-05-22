import * as Express from "express";
import { ShipsController } from "@controllers/ships.controller";
import { isError, ErrorTypes, IError } from "@lib/error.interface";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";
import { Formats } from "@lib/formats.interface";

export class ShipsRouterWrapper extends RouterWrapper {
    /**
     * singleton
     */
    private static _instance: ShipsRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new ShipsRouterWrapper();
        return this._instance;
    }

    public shipsRouter: Express.Router; 
    private shipsController: ShipsController;

    private constructor() {
        super();
        this.shipsRouter = Express.Router();
        this.shipsController = new ShipsController();
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.shipsRouter.get("/(:ship_id)?", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.directRequest(req, res, this.shipsController.handleGet, (req, res, result) => {
                // TODO: implement authorization (in controller?)
                res.status(200).json(result);
            });
        });
    
        this.shipsRouter.post("/", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.directRequest(req, res, this.shipsController.handlePost, (req, res, result) => {
                // TODO: implement this route
                res.status(201).send(`{ "id": ${result.id} }`);
            });
        });
    
        this.shipsRouter.delete("/:ship_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.shipsController.handleDelete, (req, res, result) => {
                // TODO: Deleting should be via the /ships/:shipid URL
                // TODO: authorize in controller
                res.status(204).end();
            });
        });
    }    
}
