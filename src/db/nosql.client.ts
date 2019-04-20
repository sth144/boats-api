import { Datastore } from "@google-cloud/datastore";

//

export class NoSqlClient {
    private datastore;

    constructor() { 
        this.datastore = new Datastore();
    }
}