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
        this.boatsRouter.get("/(:boat_id/cargo?)?", async (req: IRequest, res): Promise<void> => {
            // TODO: Please note that viewing cargo for a given 
            //  boat is paginated, but when viewing a single ship 
            //  the cargo list does not get paginated.
            
            /** compute response */
            this.directRequest(req, res, this.boatsController.handleGet, (req, res, result) => {
                res.status(200).json(result);
            })
            // TODO: get handler to return paginated list of a boats cargo
        
        });

        this.boatsRouter.get("/:boat_id/cargo", async (req: IRequest, res): Promise<void> => {
            });
    
        this.boatsRouter.post("/", async (req: IRequest, res): Promise<void> => {
            /** compute response */
            this.directRequest(req, res, this.boatsController.handlePost, (req, res, result) => {
                res.status(201).send(`{ "id": ${result.id} }`);
            });
            
        });

        this.boatsRouter.put("/:boat_id/cargo/:cargo_id", async () => {
            // TODO: put handler to put cargo on boat
        });
    
        this.boatsRouter.patch("/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.boatsController.handlePatch, (req, res, result) => {
                res.status(200).end();
            });
        });
    
        this.boatsRouter.delete("/:boat_id", async (req: IRequest, res): Promise<void> => {
            /** compute and send response */
            this.directRequest(req, res, this.boatsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });

        this.boatsRouter.delete(
            "/:boat_id/cargo/:cargo_id", async (req: IRequest, res): Promise<void> => {
            // TODO: implement delete handler to remove cargo from boat
        })
        // TODO: For putting cargo into boats you can use a route like 
        //  /boats/:boat_id/cargo/:cargo_id and the same thing when 
        //  removing cargo but with a different HTTP Verb.
    }    
}
