import { Datastore, Query } from "@google-cloud/datastore";
import { BOATS } from "@models/boats.model";
import { IError, ErrorTypes } from "@lib/error.interface";

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
        return (data[Datastore.KEY].id).toString();
    }

    public async runQueryForModel(query: Query): Promise<any> {
        let queryRun = await this.datastore.runQuery(query);
        return queryRun;
    }

    public async datastoreGetCollection(_kind: string): Promise<any> {
        const query: Query = this.datastore.createQuery(_kind);
        let queryResult: any[] = await this.datastore.runQuery(query)
        queryResult = queryResult[0];
        return queryResult;
    }   

    public async datastoreGetById(_kind: string, entityId: string)
        : Promise<any> {
        const _key = this.datastore.key([_kind, parseInt(entityId, 10)]);
        let [retrieved] = await this.datastore.get(_key).catch(() => {
            return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        });
        return retrieved;
    }

    public async datastoreSave(_kind: string, entityData: any): Promise<any> {
        const _key = this.datastore.key(_kind);
        const item = {
            key: _key,
            data: entityData
        }
        await this.datastore.save(item);
        return _key;
    }

    public async datastoreEdit(_kind: string, _id: string, _patch: object)
        : Promise<any> {
        const _key = this.datastore.key([_kind, parseInt(_id, 10)])
        const entity = {
            key: _key,
            data: _patch
        }
        let editSaved = await this.datastore.save(entity);
        return editSaved;
    }

    public async datastoreDelete(_kind: string, _id: string): Promise<any> {
        const _key = this.datastore.key([_kind, parseInt(_id, 10)]);
        console.log("deleting key " + JSON.stringify(_key));
        let deleted = await this.datastore.delete(_key);
        return deleted;
    }
}