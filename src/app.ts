import * as express from "express";
import { router, API_URL } from "@routes/routes.main";
import * as bodyParser from "body-parser";

/**
 * main API instance class
 */
export class App {
    private app: express.App;
    
    constructor() { 
        this.app = express();
        this.app.enable('trust proxy');

        this.app.use(bodyParser.json());
        this.app.use("/", router);
    }

    public async start(): Promise<any> {
        const PORT = process.env.PORT || 8080;
        this.app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
            console.log(`Press Ctrl+C to quit`);
        });
    }
}