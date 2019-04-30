import * as Express from "express";
import { RouterWrapper } from "./router.wrapper";
import { CargoController } from "@controllers/cargo.controller";
import { IRequest } from "@lib/request.interface";

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
        this.cargoRouter.get("", async(req: IRequest, res): Promise<void> => {
            // TODO: get handler
            // TODO: All representations of resources must have self links.
            return;
        });
        this.cargoRouter.post("", async(req: IRequest, res): Promise<void> => {
            // TODO: post handler
            return;
        });
        this.cargoRouter.put("", async(req: IRequest, res): Promise<void> => {
            // TODO: put handler
            return;
        });
        this.cargoRouter.patch("", async(req: IRequest, res): Promise<void> => {
            // TODO: patch handler
            return;
        });
        this.cargoRouter.delete("", async(req: IRequest, res): Promise<void> => {
            // TODO: delete handler
            return;
        });
    }
}