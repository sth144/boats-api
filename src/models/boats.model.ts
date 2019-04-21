import { NoSqlClient } from "db/nosql.client";

export interface IBoat {
    id: string,     // auto-generated
    name: string,   // human-readable unique name
    type: string,   // type of boat
    length: number  // length of boat
}

export class BoatsModel {
    private _nosqlClient: NoSqlClient;

    constructor(nosqlClient: NoSqlClient) { 
        this._nosqlClient = nosqlClient;
    }


}