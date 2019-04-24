import { NoSqlClient } from "@db/nosql.client";

export abstract class Model {
    protected nosqlClient: NoSqlClient;

    constructor() { }

    public abstract confirmInterface(obj: object): boolean;
}