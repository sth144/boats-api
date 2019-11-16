import * as Express from "express";
import { BoatsController } from "@controllers/boats.controller";
import { isError, ErrorTypes, IError } from "@lib/error.interface";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";
import { Formats } from "@lib/formats.interface";

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
            console.log("get boats")
            this.directRequest(req, res, this.boatsController.handleGet, (req, res, result) => {
                if (req.headers.accept == Formats.JSON) {
                    res.set("Content", Formats.JSON);
                    res.status(200).json(result);
                } else if (req.headers.accept == Formats.HTML) {
                    res.set("Content", Formats.HTML);
                    res.status(200).send(result);
                }
            });
        });

        this.boatsRouter.get("/:boat_id/cargo", async (req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.boatsController.handleGet, (req, res, result) => {
                res.status(200).json(result);
            });
        });
    
        this.boatsRouter.post("/", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.directRequest(req, res, this.boatsController.handlePost, (req, res, result) => {
                res.status(201).send(`{ "id": ${result.id} }`);
            });
        });

        this.boatsRouter.put("/:boat_id/cargo/:cargo_id", async (req, res): Promise<void> => {
            this.directRequest(req, res, this.boatsController.handlePut, (req, res, result) => {                
                res.status(200).end();
            })
        });

        this.boatsRouter.put("/(:boat_id)?", async (req, res) => {
            this.directRequest(req, res, this.boatsController.handlePut, (req, res, result) => {
                res.status(303).set("Location", result.self).send();
            });
        });
    
        this.boatsRouter.patch("/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.boatsController.handlePatch, (req, res, result) => {
                res.status(200).end();
            });
        });
    
        this.boatsRouter.delete("/(:boat_id)?", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.boatsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });

        this.boatsRouter.delete(
            "/:boat_id/cargo/:cargo_id", async (req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.boatsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });
    }    
}
