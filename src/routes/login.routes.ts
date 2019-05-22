import * as Express from "express";
import { RouterWrapper } from "@routes/router.wrapper";
import { IRequest } from "@lib/request.interface";
import { API_URL } from "./urls";
import * as request from "request";

export class LoginRouterWrapper extends RouterWrapper {
    private static _instance: LoginRouterWrapper;
    public static get Instance() {
        if (!this._instance) this._instance = new LoginRouterWrapper();
        return this._instance;
    }

    public loginRouter: Express.Router;

    private constructor() { 
        super();
        this.loginRouter = Express.Router();
        // TODO: instantiate controller?
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.loginRouter.post("/", async(req: IRequest, res): Promise<void> => {
            this.directRequest(req, res, this.handlePost, (req, res, postOptions) => {
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

    private async handlePost(req) {
        // TODO: login route takes user name and password to retrieve jwt token
        const username = req.body.username;
        const password = req.body.password;
        const options = {
            method: "POST",
            url: `https://dev-hdtedn05.auth0.com/oauth/token`, // TODO: oauth endpoint?
            headers: { "content-type": "application/json" },
            body: {
                grant_type: "password",
                username: username,
                password: password,

                connection: "Username-Password-Authentication",
                /** 
                 * not concerned with security in this example, issues using environment
                 *  variables on gcloud
                 */
                client_id: process.env.CLIENT_ID,  // TODO: client id
                client_secret: process.env.CLIENT_SECRET,
            },
            json: true
        };
        return options;
    }
}