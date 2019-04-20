import * as Express from "express";
import * as crypto from "crypto";
import { NoSqlClient } from "./db/nosql.client";
import { BoatsModel } from "./models/boats.model";
import { SlipsModel } from "./models/slips.model";

export class App {
    private app: Express.app
    private nosqlClient: NoSqlClient;
    private boatModel: BoatsModel;
    private slipModel: SlipsModel;
    
    constructor() { 
        this.app = Express();
        this.app.enable('trust proxy');

        this.app.use("/", require("./controller/routes"));

        this.nosqlClient = new NoSqlClient();
        this.boatModel = new BoatsModel(this.nosqlClient);
        this.slipModel = new SlipsModel(this.nosqlClient);
    }

    public async start(): Promise<any> {
        const PORT = process.env.PORT || 8080;
        this.app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
            console.log(`Press Ctrl+C to quit`);
        });
    }
}