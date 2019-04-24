import { NoSqlClient } from "@db/nosql.client";

export interface IBoat {
    /** id: string, */  // auto-generated
    name: string,       // human-readable unique name
    type: string,       // type of boat
    length: number      // length of boat
}

export const BOATS = "boats";

// TODO: implement model base class?

export class BoatsModel {
    private nosqlClient: NoSqlClient;

    constructor() { 
        this.nosqlClient = NoSqlClient.Instance;
        console.log("BoatsModel initialized");
    }

    public static isIBoat(entity: any): boolean {
        if (!("name" in entity) || !("type" in entity) || !("length" in entity)) {
            return false;
        } else return true;
    }

    public async getBoatIdByName(name: string) {
        const query = this.nosqlClient.datastore.createQuery(BOATS)
            .filter("name", "=", name);
        return await this.nosqlClient.runModelQuery(query);
    }

    public async getBoatsById(boatIds: number[]) {
        this.nosqlClient.datastoreGet(boatIds);
    }

    public async createBoat(newBoat: IBoat) {
        return await this.nosqlClient.datastorePost(newBoat, BOATS);
    }

    public async deleteBoatById() {

    }

    public async editBoat() {

    }

    public async setBoatStatus() {
        // A boat should be able to arrive and be assigned a slip number specified 
        // in the request (no automatically assigning boats to slips)

        // If the slip is occupied the server should return an Error 403 Forbidden message
        // This will require knowing the slip, date of arrival and boat
    }
}