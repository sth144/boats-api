import * as express from "express";
import * as crypto from "crypto";
import { NoSqlClient } from "@db/nosql.client";
import { BoatsModel } from "@models/boats.model";
import { SlipsModel } from "@models/slips.model";
import { router } from "@routes/routes";
import * as bodyParser from "body-parser";

const Datastore = require("@google-cloud/datastore");

export class App {
    private app: express.App;
    private nosqlClient: NoSqlClient;
    private boatModel: BoatsModel;
    private slipModel: SlipsModel;
    
    constructor() { 
        this.app = express();
        this.app.enable('trust proxy');

        this.app.use(bodyParser.json());
        this.app.use("/", router);
        // this.app.get("/", (req, res) => {
        //     console.log("got");
        //     res.status(200).end();
        // })

        // let datastore = new Datastore.Datastore();
        // this.app.get("/", async (req, res) => {
        //     datastore.save({
        //         key: datastore.key("boats"),
        //         data: {
        //             id: Math.random().toString(32).substring(2,10),
        //             name: Math.random().toString(32).substring(2,10),
        //             type: "boat",
        //             length: Math.random()
        //         }
        //     });

        //     let query = datastore.createQuery("boats")
        //     datastore.runQuery(query)
        //         .then((results) => {
        //             for (let result of results[0]) {
        //                 // let id = result[datastore.KEY].id;
        //                 // datastore.delete(id);
        //                 console.log(result[datastore.KEY].id);
        //                 let id = result[datastore.KEY].id;
        //                 const key = datastore.key(["boats", parseInt(id, 10)]);
        //                 console.log(key);
        //                 datastore.delete(key);
        //             }
            
        //             res.status(200).set("Content-type", "text/plain")
        //                 .send(JSON.stringify(results));
        //         });
        // });
    }

    public async start(): Promise<any> {
        const PORT = process.env.PORT || 8080;
        this.app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
            console.log(`Press Ctrl+C to quit`);
        });
    }
}