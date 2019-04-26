import { NoSqlClient } from "@db/nosql.client";
import { Model } from "@models/model";
import { IError, ErrorTypes } from "@lib/error.interface";
import { isError } from "util";
import { Query } from "@google-cloud/datastore";
import { API_URL } from "@routes/routes.main";

export interface IBoatPrototype {
    id?: string,
    name: string,       // human-readable unique name
    type: string,       // type of boat
    length: number      // length of boat
    self?: string
}

export interface IBoatResult {
    id: string,         // auto-generated
    name: string,
    type: string,
    length: number,
    self: string
}

export const BOATS = "boats";

export class BoatsModel extends Model {
    private static _instance: BoatsModel;
    public static get Instance(): BoatsModel {
        if (!this._instance) this._instance = new BoatsModel();
        return this._instance;
    }

    protected nosqlClient: NoSqlClient;
    private deleteCallback: Function;

    private constructor() { 
        super();
        this.nosqlClient = NoSqlClient.Instance;
        console.log("BoatsModel initialized");
    }

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

    public async boatExistsById(_id: string): Promise<boolean> {
        let result = await this.getBoatById(_id);
        if (isError(result)) return false;
        return true;
    }

    public registerDeleteCallback(_cb: Function): void {
        this.deleteCallback = _cb;
    }

    public async getBoatById(boatId: string): Promise<IBoatResult | IError> {
        let boat = await this.nosqlClient.datastoreGetById(BOATS, boatId);
        if (boat == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return boat;
    }

    public async getAllBoats(): Promise<IBoatResult[] | IError> {
        let allBoats = await this.nosqlClient.datastoreGetCollection(BOATS);
        if (allBoats == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allBoats;
    }

    public async createBoat(_name: string, _type: string, _length: number) {
        const newBoat: IBoatPrototype = {
            name: _name,
            type: _type,
            length: _length
        }

        let newKey = await this.nosqlClient.datastoreSave(BOATS, newBoat);

        /** 
         * id property copied from KEY
         */
        Object.assign(newBoat, { id: newKey.id });

        /**
         * create live link and update entity in datastore
         */
        Object.assign(newBoat, { self: `${API_URL}/${BOATS}/${newBoat.id}` });

        /**
         * update with live link and id
         */
        await this.nosqlClient.datastoreSave(BOATS, newBoat);

        return newKey;
    }

    public async deleteBoat(boatId: string): Promise<any> {
        return this.nosqlClient.datastoreDelete(BOATS, boatId)
            .then(() => {
                if (typeof this.deleteCallback === undefined) 
                    this.deleteCallback(boatId);
            })
    }

    public async editBoat(boatId: string, editBoat: Partial<IBoatPrototype>)
        : Promise<any | IError> {
        if (this.boatExistsById(boatId)) {
            let edited = await this.nosqlClient.datastoreEdit(BOATS, boatId, editBoat);
            return edited;
        } else return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }
}