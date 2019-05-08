import * as Express from "express";
import { BoatsController } from "@controllers/boats.controller";
import { isError, ErrorTypes, IError } from "@lib/error.interface";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";

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
            console.log(req.headers);

            this.directRequest(req, res, this.boatsController.handleGet, (req, res, result) => {
                if (req.headers.accept == "application/json") {
                    res.set("Content", "application/json");
                    res.status(200).json(result);
                } else {
                    console.log("client wants html");
                }
            });

            // TODO: You should be able to view the list of boats as JSON.

            // TODO: You should be able to view an individual boat either as JSON 
            //          or HTML depending on the Accept header sent by the client. 
            //          The options being application/json or text/html. I would 
            //          recommend returning the boat as a simple `ul`, with `li` 
            //          attributes. It does not need to be a full HTML page.

            // TODO: You should appropriately use the following 2xx status codes
            //          200
            //          201
            //          204

            // TODO: send back 406 status for request with bad media type
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

        this.boatsRouter.put("/:boat_id/cargo/:cargo_id", async (req, res) => {
            this.directRequest(req, res, this.boatsController.handlePut, (req, res, result) => {                
                res.status(200).end();
            })
        });
    
        // TODO: 303 - When you PUT to edit a boat, you should return a 303 code 
        //      with the location of the updated boat in the appropriate header field
        //       - implement PUT handler for editing boat?

        // TODO: You should appropriately use the following 4xx status codes
        //          405 - Use this for PUT or DELETE on the root boat URL 
        //              (you cannot edit or delete the entire list of boats!)
        //          406

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
            // TODO: 405 response for root url
            this.directRequest(req, res, this.boatsController.handleDelete, (req, res, result) => {
                res.status(204).end();
            });
        });
    }    
}
