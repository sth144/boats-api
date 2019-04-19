import * as Express from "express";
import * as crypto from "crypto";
const {Datastore} = require("@google-cloud/datastore");
import * as next from "next";

export class App {
    private app: Express.app
    private datastore: any;

    constructor() { 
        this.app = Express();
        this.app.enable('trust proxy');
        this.datastore = new Datastore({
            
        });
    }

    public async start(): Promise<any> {
        this.app.get("/", async function(req, res) {
            console.log("get");
            // Create a visit record to be stored in the database
            const visit = {
                timestamp: new Date(),
                // Store a hash of the visitor's ip address
                userIp: crypto
                    .createHash('sha256')
                    .update(req.ip)
                    .digest('hex')
                    .substr(0, 7),
            };


            try {
                console.log("try");
                await this.insertVisit(visit);
                console.log("inserted)");
                const results = await this.getVisits();
                const entities = results[0];
                const visits = entities.map(
                    entity => `Time: ${entity.timestamp}, AddrHash: ${entity.userIp}`
                );
                res.status(200)
                    .set('Content-Type', 'text/plain')
                    .send(`Last 10 visits:\n${visits.join('\n')}`)
                    .end();
            } catch (error) {
                console.log("error " + error);
            //     // TODO: how to handle errors?
            //     //next(error);
            }
        }.bind(this));

        const PORT = process.env.PORT || 8080;
        this.app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
            console.log(`Press Ctrl+C to quit`);
        });
    }


    /**
     * Insert a visit record into the database.
     *
     * @param {object} visit The visit record to insert.
     */
    public insertVisit(visit) {
        console.log("insert");
        return this.datastore.save({
            key: this.datastore.key('visit'),
            data: visit,
        });
    }

    /**
     * Retrieve the latest 10 visit records from the database.
     */
    public getVisits() {
        console.log("get");
        const query = this.datastore
            .createQuery('visit')
            .order('timestamp', {descending: true})
            .limit(10);
    
        return this.datastore.runQuery(query);
    }
}