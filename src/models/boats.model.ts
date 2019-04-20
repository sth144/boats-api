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

    public getBoat(): IBoat {
        // You should be able to either view a single entity or the entire collections of entities, 
        // for example, I should be able to view the details of a single boat as well as get a list 
        // of all boats
        // When viewing a boat or slip, the response should include a live link (url) to view said 
        // boat or slip. (Please review how Gist results have a url field that contains a complete url)

        return
    }

    public createBoat() {
        // All newly created boats should start "At sea" and not in a slip
    }

    public deleteBoat() {
        // Deleting a boat should empty the slip the ship was previously in automatically
    }

    public editBoat() {
        // You should be able to modify any property except for the ID
    }

    public setBoatStatus() {
        // A boat should be able to arrive and be assigned a slip number specified 
        // in the request (no automatically assigning boats to slips)

        // If the slip is occupied the server should return an Error 403 Forbidden message
        // This will require knowing the slip, date of arrival and boat
    }


}