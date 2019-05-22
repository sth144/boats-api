import * as Express from "express";
import { router } from "@routes/routes.main";
import * as bodyParser from "body-parser";

/**
 * main API instance class
 */
export class App {
    private _app: Express.Application;
    
    constructor() { 
        this._app = Express();
        this._app.enable('trust proxy');

        this._app.use(bodyParser.json());
        this._app.use("/", router);
    }

    public async start(): Promise<any> {
        const PORT = process.env.PORT || 8080;
        this._app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
            console.log(`Press Ctrl+C to quit`);
        });
    }
}