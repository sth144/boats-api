import { Datastore } from "@google-cloud/datastore";
import { BOATS } from "@models/boats.model";

//

export class NoSqlClient {
    private static _instance: NoSqlClient;
    public static get Instance() {
        if (!this._instance) this._instance = new NoSqlClient();
        return this._instance;
    }

    public datastore: Datastore;

    private constructor() { 
        this.datastore = new Datastore();
        console.log("datastore initialized");
    }

    public async runModelQuery(query) {
        return await this.datastore.runQuery(query);
    }

    public async datastoreGet(entityIds: number[]) {
        const query = this.datastore.createQuery(BOATS);
        return await this.datastore.runQuery(query);
    }

    public async datastorePost(entityData: any, entityName: string) {
        const _key = this.datastore.key(entityName);
        this.datastore.save({
            key: _key,
            data: entityData
        });
        console.log(JSON.stringify(_key));
        return _key;
    }

    public async datastorePatch() {

    }

    public async datastorePut() {

    }

    public async datastoreDelete() {

    }
}