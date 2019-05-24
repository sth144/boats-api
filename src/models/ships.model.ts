import { NoSqlClient } from "@db/nosql.client";
import { Model } from "@models/model";
import { IError, ErrorTypes, isError } from "@lib/error.interface";
import { Datastore, Query } from "@google-cloud/datastore";
import { API_URL } from "@routes/urls";
import { Formats } from "@lib/formats.interface";

/**
 * interface used for constructing and inserting ship objects into the datastore
 *  (validates post requests)
 * @property id     unique identifier. Not supplied by client
 * @property name   ship name (must be unique)   
 * @property type   ship type 
 * @property length ship length
 * @property owner  ship owner
 * @property self   a live link to the sh1ip object
 */
export interface IShipPrototype {
    id?: string,
    name: string,       
    type: string,       
    length: number     
    owner: string,
    self?: string
}

/**
 * interface used to validate ship objects retrieved from the datastore
 */
export interface IShipResult {
    id: string,        
    name: string,
    type: string,
    length: number,
    owner: string,
    self: string
}

export const SHIPS = "ships";

/**
 * manages construction, editing, and deletion of ship objects in 
 *  the google-cloud datastore
 */
export class ShipsModel extends Model {
    /**
     * singleton
     */
    private static _instance: ShipsModel;
    public static get Instance(): ShipsModel {
        if (!this._instance) this._instance = new ShipsModel();
        return this._instance;
    }

    protected nosqlClient: NoSqlClient;

    private constructor() { 
        super();        
        this.nosqlClient = NoSqlClient.Instance;
        
        console.log("ShipsModel initialized");
    }

    /** check that name supplied in request is unique */
    public async nameUnique(_testName: string): Promise<boolean> {
        /** get all names */
        let allShips = await this.getAllShips() as IShipResult[];
        if (!isError(allShips)) {
            /** check against each name */
            for (let ship of allShips) 
                if (_testName == ship.name) 
                    return false;
        }
        /** name is unique */
        return true;
    }

    /**
     * determine if an object conforms to the Iship interface
     */
    public confirmInterface(obj: any): boolean {
        if (!("name in obj") || !("type" in obj) || !("length" in obj) || !("owner" in obj)
            || !(typeof obj.name == "string")
            || !(typeof obj.type == "string")
            || !(typeof obj.length == "number")
            || !(typeof obj.owner == "string")) {
            return false;
        } return true;
    }

    /** 
     * confirm that ship with id exists 
     */
    public async shipExistsById(_id: string): Promise<boolean> {
        let result = await this.getShipById(_id) as IShipResult;
        if (isError(result)) return false;
        return true;
    }


    /**
     * retrieve a ship object by its datastore id
     */
    public async getShipById(shipId: string, format: string = Formats.JSON)
        : Promise<IShipResult | IError> {
        let ship = await this.nosqlClient.datastoreGetById(SHIPS, shipId);
        if (ship == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return ship;
    }

    /**
     * retrieve entire collection (all SHIPS)
     */
    public async getAllShips(): Promise<IShipResult[] | IError> {
        let allShips = await this.nosqlClient.datastoreGetCollection(SHIPS);
        if (allShips == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allShips;
    }

    public async getShipsForUser(userId: string): Promise<IShipResult[] | IError> {
        let query: Query = this.nosqlClient.datastore.createQuery(SHIPS)
            .filter("owner", "=", userId);
        const results = await this.nosqlClient.runQueryForModel(query);
        const entities = results[0];
        return entities;
    }

    /**
     * create a new ship object in the datastore
     */
    public async createShip(_name: string, _type: string, _length: number, _owner: string)
        : Promise<string | IError> {        
        const newData: IShipPrototype = {
            name: _name,
            type: _type,
            length: _length,
            owner: _owner
        }

        let newKey = await this.nosqlClient.datastoreSave(SHIPS, newData);

        Object.assign(newData, { id: `${newKey.id}` });
        Object.assign(newData, { self: `${API_URL}/${SHIPS}/${newKey.id}` });

        const newShip = {
            key: newKey,
            data: newData
        }
        
        await this.nosqlClient.datastoreUpsert(newShip);

        return newKey;
    }

    /**
     * delete a ship from datastore
     */
    public async deleteShip(shipId: string): Promise<any> {
        return this.nosqlClient.datastoreDelete(SHIPS, shipId)
            .then(() => {
                for (let deleteCallback of this.deleteCallbacks)
                    deleteCallback(shipId);
            });
    }
}