import * as Express from "express";
import { RouterWrapper } from "./router.wrapper";
import { CargoController } from "@controllers/cargo.controller";
import { IRequest } from "@lib/request.interface";
import { isError, IError } from "@lib/error.interface";

export class CargoRouterWrapper extends RouterWrapper {
    /**
     * singleton
     */
    private static _instance: CargoRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new CargoRouterWrapper();
        return this._instance;
    }

    public cargoRouter: Express.Router;
    private cargoController: CargoController;

    private constructor() {
        super();
        this.cargoRouter = Express.Router();
        this.cargoController = new CargoController();
        this.setupRoutes();
    }
    
    protected setupRoutes(): void {
        this.cargoRouter.get("/(:cargo_id)?", async (req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.cargoController.handleGet, (req, res, result) => {
                res.status(200).json(result);
            });
        });

        this.cargoRouter.post("/", async (req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.cargoController.handlePost, (req, res, result) => {
                res.status(201).send(`{ "id": ${result.id} }`);
            });
        });

        this.cargoRouter.patch("/:cargo_id", async (req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.cargoController.handlePatch, (req, res, result) => {
                res.status(200).end();
            });
        });

        this.cargoRouter.delete("/:cargo_id", async (req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.cargoController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });
    }
}