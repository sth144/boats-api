import * as Express from "express";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";
import { LoginController } from "@controllers/login.controller";
import * as request from "request";

export class LoginRouterWrapper extends RouterWrapper {
    private static _instance: LoginRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new LoginRouterWrapper();
        return this._instance;
    }

    public loginRouter: Express.Router;
    private loginController: LoginController

    private constructor() { 
        super();
        this.loginRouter = Express.Router();
        this.loginController = new LoginController();
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.loginRouter.post("/", async(req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.loginController.handlePost, (req, res, postOptions) => {
                request.post(postOptions, (error, response, body) => {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        res.send(body)
                        // TODO: send jwt back
                    }
                });
                // TODO: what to put here, what to delegate to previous callback?
            });
        });   
    }


}