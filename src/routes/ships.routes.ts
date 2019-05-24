import * as Express from "express";
import { ShipsController } from "@controllers/ships.controller";
import { isError, ErrorTypes, IError } from "@lib/error.interface";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";
import { Formats } from "@lib/formats.interface";
import { AuthenticationService } from "@base/authentication/authentication.service";

export class ShipsRouterWrapper extends RouterWrapper {
    /**
     * singleton
     */
    private static _instance: ShipsRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new ShipsRouterWrapper();
        return this._instance;
    }

    public shipsRouter: Express.Router = Express.Router(); 
    private shipsController: ShipsController = new ShipsController();
    private verifier = AuthenticationService.Instance.JwtVerifier;

    private constructor() {
        super();
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.shipsRouter.get("/(:ship_id)?", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.directRequest(req, res, this.shipsController.handleGet, (req, res, result) => {
                res.status(200).json(result);
            });
        });
    
        this.shipsRouter.post("/", this.verifier, async (req: IRequest, res): Promise<void> => {            
            /**
             * returns 401 unauthorized if no or invalid JWT
             */
            this.directRequest(req, res, this.shipsController.handlePost, (req, res, result) => {
                res.status(201).send(`{ "id": ${result.id} }`);
            });
        });
    
        this.shipsRouter.delete("/:ship_id", this.verifier, async (req: IRequest, res)
            : Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.shipsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });
    }    
}
