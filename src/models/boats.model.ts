import { NoSqlClient } from "@db/nosql.client";
import { Model } from "@models/model";
import { IError, ErrorTypes } from "@lib/error.interface";
import { isError } from "util";
import { Query } from "@google-cloud/datastore";
import { API_URL } from "@routes/routes.main";

/**
 * interface used for constructing and inserting boat objects into the datastore
 *  (validates post requests)
 * @property id     unique identifier. Not supplied by client
 * @property name   boat name (must be unique)   
 * @property type   boat type 
 * @property length boat length
 * @property self   a live link to the boat object
 */
export interface IBoatPrototype {
    id?: string,
    name: string,       
    type: string,       
    length: number     
    self?: string
}

/**
 * interface used to validate boat objects retrieved from the datastore
 */
export interface IBoatResult {
    id: string,        
    name: string,
    type: string,
    length: number,
    self: string
}

export const BOATS = "boats";

/**
 * manages construction, editing, and deletion of boat objects in 
 *  the google-cloud datastore
 */
export class BoatsModel extends Model {
    /**
     * singleton
     */
    private static _instance: BoatsModel;
    public static get Instance(): BoatsModel {
        if (!this._instance) this._instance = new BoatsModel();
        return this._instance;
    }

    private constructor() { 
        super();
        this.nosqlClient = NoSqlClient.Instance;
        console.log("BoatsModel initialized");
    }

    /** check that name supplied in request is unique */
    public async nameUnique(_testName: string): Promise<boolean> {
        /** get all names */
        let allBoats = await this.getAllBoats() as IBoatResult[];
        if (!isError(allBoats)) {
            /** check against each name */
            for (let boat of allBoats) 
                if (_testName == boat.name) 
                    return false;
        }
        /** name is unique */
        return true;
    }

    /**
     * determine if an object conforms to the IBoat interface
     */
    public confirmInterface(obj: any): boolean {
        if (!("name" in obj) || !("type" in obj) || !("length" in obj)
            || !(typeof obj.name == "string")
            || !(typeof obj.type == "string")
            || !(typeof obj.length == "number")) {
            return false;
        } else return true;
    }

    /** 
     * confirm that boat with id exists 
     */
    public async boatExistsById(_id: string): Promise<boolean> {
        let result = await this.getBoatById(_id);
        if (isError(result)) return false;
        return true;
    }


    /**
     * retrieve a boat object by its datastore id
     */
    public async getBoatById(boatId: string): Promise<IBoatResult | IError> {
        let boat = await this.nosqlClient.datastoreGetById(BOATS, boatId);
        if (boat == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return boat;
    }

    /**
     * retrieve entire collection (all boats)
     */
    public async getAllBoats(): Promise<IBoatResult[] | IError> {
        let allBoats = await this.nosqlClient.datastoreGetCollection(BOATS);
        if (allBoats == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allBoats;
    }

    /**
     * create a new boat object in the datastore
     */
    public async createBoat(_name: string, _type: string, _length: number)
        : Promise<string | IError> {
        const newData: IBoatPrototype = {
            name: _name,
            type: _type,
            length: _length,
        }

        let newKey = await this.nosqlClient.datastoreSave(BOATS, newData);

        /**
         * create live link and update entity in datastore
         */
        Object.assign(newData, { id: `${newKey.id}` });
        Object.assign(newData, { self: `${API_URL}/${BOATS}/${newKey.id}` });

        const newBoat = {
            key: newKey,
            data: newData
        }

        /**
         * update with live link and id
         */
        await this.nosqlClient.datastoreUpsert(newBoat);

        return newKey;
    }

    /**
     * delete a boat from datastore
     */
    public async deleteBoat(boatId: string): Promise<any> {
        return this.nosqlClient.datastoreDelete(BOATS, boatId)
            .then(() => {
                if (typeof this.deleteCallback !== undefined) 
                    this.deleteCallback(boatId);
            });
    }

    /**
     * edit existing boat
     */
    public async editBoat(boatId: string, editBoat: Partial<IBoatPrototype>)
        : Promise<any | IError> {
        if (this.boatExistsById(boatId)) {
            let edited = await this.nosqlClient.datastoreEdit(BOATS, boatId, editBoat);
            return edited;
        } else return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }
}