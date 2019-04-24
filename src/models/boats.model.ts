import { NoSqlClient } from "@db/nosql.client";
import { Model } from "@models/model";
import { IError, ErrorTypes } from "@lib/error.interface";
import { isError } from "util";
import { Query } from "@google-cloud/datastore";

export interface IBoat {
    /** id: string, */  // auto-generated
    name: string,       // human-readable unique name
    type: string,       // type of boat
    length: number      // length of boat
}

export interface IBoatResult {
    // TODO: implement this interface
    //      data, live link
    name: string,
    type: string,
    length: number,
    link: string
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
            for (let boat of allBoats) {
                // TODO: make sure name accessor correct
                if (_testName == boat.name) {
                    return false;
                }
            }
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
        return this.getBoatById(_id).then((result) => {
            if (!isError(result)) return true
            return false;
        });
    }

    public registerDeleteCallback(_cb: Function): void {
        this.deleteCallback = _cb;
    }

    public async retrieveIdFromBoat(boatData: IBoat): Promise<string> {
        // TODO: test this
        return this.nosqlClient.getIdFromData(boatData);
    }

    public async getBoatByName(boatName: string): Promise<any> {
        const query: Query = this.nosqlClient.datastore.createQuery(BOATS)
            .filter("name", "=", boatName);
        return await this.nosqlClient.runQueryForModel(query);
    }

    public async getBoatById(boatId: string): Promise<IBoatResult | IError> {
        // TODO: incorporate live link into returned value
        return await this.nosqlClient.datastoreGetById(BOATS, boatId);
    }

    public async getAllBoats(): Promise<IBoatResult[] | IError> {
        // TODO: incorporate live link into returned value
        return await this.nosqlClient.datastoreGetCollection(BOATS);
    }

    public async createBoat(_name: string, _type: string, _length: number) {
        const newBoat: IBoat = {
            name: _name,
            type: _type,
            length: _length
        }
        return await this.nosqlClient.datastoreSave(BOATS, newBoat);
    }

    public async deleteBoat(boatId: string): Promise<any> {
        return this.nosqlClient.datastoreDelete(BOATS, boatId)
            .then(() => {
                if (typeof this.deleteCallback === undefined) 
                    this.deleteCallback(boatId);
            })
    }

    public async editBoat(boatId: string, editBoat: Partial<IBoat>)
        : Promise<any | IError> {
        if (this.boatExistsById(boatId)) {
            return this.nosqlClient.datastoreEdit(BOATS, boatId, editBoat);
        } else return <IError>{ error_type: ErrorTypes.DOESNT_EXIST }
    }
}