import { NoSqlClient } from "@db/nosql.client";

/**
 * base class for data models
 */
export abstract class Model {
    protected nosqlClient: NoSqlClient;

    constructor() { }

    public abstract confirmInterface(obj: object): boolean;
}