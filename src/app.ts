import * as Express from "express";
import * as crypto from "crypto";
import { NoSqlClient } from "./db/nosql.client";
import { BoatsModel } from "./models/boats.model";
import { SlipsModel } from "./models/slips.model";
import { router } from "./routes/routes";

import { Datastore } from "@google-cloud/datastore";

export class App {
    private app: Express.app
    private nosqlClient: NoSqlClient;
    private boatModel: BoatsModel;
    private slipModel: SlipsModel;
    
    constructor() { 
        this.app = Express();
        this.app.enable('trust proxy');

        //this.app.use("/", router);


        let datastore = new Datastore();
        this.app.get("/", async (req, res) => {
            datastore.save({
                key: datastore.key("boats"),
                data: {
                    id: Math.random().toString(32).substring(2,10),
                    name: Math.random().toString(32).substring(2,10),
                    type: "boat",
                    length: Math.random()
                }
            });

            // TODO: figure out delete

            let query = datastore.createQuery("boats")
            let results = await datastore.runQuery(query);
            
            res.status(200).set("Content-type", "text/plain")
                .send(JSON.stringify(results));
        });





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