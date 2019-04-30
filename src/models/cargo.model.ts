import { Model } from "./model";
import { IBoatRef } from "./slips.model";
import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { NoSqlClient } from "@db/nosql.client";
import { isError } from "util";
import { IError, ErrorTypes } from "@lib/error.interface";

/**
 * interface used to create and insert slip objects into
 *  datastore
 * @property id         unique datastore identifier (auto-generated)
 * @property weight     cargo weight
 * @property carrier    boat carrying the cargo
 * @property content    cargo content
 * @property self       a live self-referential hyperlink
 */
export interface ICargoPrototype {
    id?: string,
    weight: number,
    carrier?: IBoatRef,
    content: string,
    delivery_date: string,
    self?: string
}

/**
 * used to validate object retrieved from datastore
 */
export interface ICargoResult {
    id: string,
    weight: number,
    carrier: IBoatRef,
    content: string,
    delivery_date: string,
    self: string
}

export const CARGO = "cargo";

/**
 * manages construction, editing, and deletion of boat objects in
 *  the google-cloud datastore
 */
export class CargoModel extends Model {
    /**
     * singleton
     */
    private static _instance: CargoModel;
    public static get Instance(): CargoModel {
        if (!this._instance) this._instance = new CargoModel();
        return this._instance;
    }
    
    constructor() {
        super();
        this.nosqlClient = NoSqlClient.Instance;
        console.log("BoatsModel initialized");
    }


    /**
     * determine if an object conforms to ICargo interface
     */
    public confirmInterface(obj: object): boolean {
        // TODO: confirm interface
        return true;
    }

    /**
     * confirm that cargo with id exists
     */
    public async cargoExistsById(_id: string): Promise<boolean> {
        let result = await this.getCargoById(_id);
        if (isError(result)) return false;
        return true;
    }

    /**
     * retrieve cargo by datastore id
     */
    public async getCargoById(cargoId: string): Promise<ICargoResult | IError> {
        let cargo = await this.nosqlClient.datastoreGetById(CARGO, cargoId);
        if (cargo == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return cargo;
    }
    
    /**
     * retrieve entire collection (all cargo)
     */
    public async getAllCargo(): Promise<ICargoResult[] | IError> {
        let allCargo = await this.nosqlClient.datastoreGetCollection(CARGO);
        if (allCargo == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allCargo; 
    }

    /**
     * create a new cargo object in the datastore
     */
    public async createCargo(/** TODO: pass params */): Promise<string | IError> {
        // TODO: implement createCargo
        return;
    }

    /**
     * delete cargo from datastore
     */
    public async deleteCargo(cargoId: string): Promise<any> {
        return this.nosqlClient.datastoreDelete(CARGO, cargoId)
            .then(() => {
                if (typeof this.deleteCallback !== undefined) {

                }
            });
    }

    /**
     * edit existing cargo
     */
    public async editCargo(cargoId: string, editCargo: Partial<ICargoPrototype>) {
        if (await this.cargoExistsById(cargoId)) {
            let edited = await this.nosqlClient.datastoreEdit(CARGO, cargoId, editCargo);
            return edited;
        } else return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }
}