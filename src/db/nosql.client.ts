import { Datastore, Query } from "@google-cloud/datastore";
import { BOATS } from "@models/boats.model";

export class NoSqlClient {
    private static _instance: NoSqlClient;
    public static get Instance() {
        if (!this._instance) this._instance = new NoSqlClient();
        return this._instance;
    }

    public datastore: Datastore;

    private constructor() { 
        this.datastore = new Datastore();
        console.log("Datastore initialized");
    }

    public async getIdFromData(data: any): Promise<string> {
        // TODO: test this
        return (data[Datastore.KEY].id).toString();
    }

    public async runQueryForModel(query: Query): Promise<any> {
        return await this.datastore.runQuery(query);
    }

    public async datastoreGetCollection(_kind: string): Promise<any> {
        const query: Query = this.datastore.createQuery(_kind);
        // TODO: confirm that [0] accessor is correct
        return await this.datastore.runQuery(query)[0];
    }   

    public async datastoreGetById(_kind: string, entityId: string)
        : Promise<any> {
        const _key = this.datastore.key([_kind, parseInt(entityId, 10)]);
        return await this.datastore.get(_key);
        // TODO: need [0] accessor?
    }

    public async datastoreSave(_kind: string, entityData: any): Promise<any> {
        const _key = this.datastore.key(_kind);
        const item = {
            key: _key,
            data: entityData
        }
        this.datastore.save(item)
            .then(() => { return _key })
    }

    public async datastoreEdit(_kind: string, _id: string, _patch: object)
        : Promise<any> {
        const _key = this.datastore.key([_kind, parseInt(_id, 10)])
        const entity = {
            key: _key,
            data: _patch
        }
        return this.datastore.save(entity);
    }

    public async datastoreDelete(_kind: string, _id: string): Promise<any> {
        const _key = this.datastore.key([_kind, parseInt(_id, 10)]);
        return await this.datastore.delete(_key);
    }
}