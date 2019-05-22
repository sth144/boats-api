import { Model } from "./model";
import { IBoatRef } from "./slips.model";
import { NoSqlClient } from "@db/nosql.client";
import { Datastore, Query } from "@google-cloud/datastore";
import { IError, ErrorTypes, isError } from "@lib/error.interface";
import { API_URL } from "@routes/urls";
import { Formats } from "@lib/formats.interface";

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

export interface ICargoRef {
    id: string,
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
        if (!("weight" in obj) || !("content" in obj) || !("delivery_date" in obj)) {
            return false
        } return true;
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
    public async getCargoById(cargoId: string, format: string = Formats.JSON): Promise<ICargoResult | IError> {
        let cargo = await this.nosqlClient.datastoreGetById(CARGO, cargoId);
        if (cargo == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        
        switch (format) {
            case Formats.HTML: {
                // 
            } break;
            default: case Formats.JSON: {
                return cargo;
            } break;
        }
    }
    
    /**
     * retrieve entire collection (all cargo)
     */
    public async getAllCargo(): Promise<ICargoResult[] | IError> {
        let allCargo = await this.nosqlClient.datastoreGetCollection(CARGO);
        if (allCargo == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allCargo; 
    }

    public async getAllCargoPaginated(_cursor?): Promise<any> {
        let query: Query = this.nosqlClient.datastore.createQuery(CARGO).limit(3);
        if (_cursor) {
            query = query.start(_cursor);
        }
        const results = await this.nosqlClient.runQueryForModel(query);
        const entities = results[0];
        const info = results[1];
        const next_cursor = results[1].endCursor;
        let next_link = null;

        if (info.moreResults !== this.nosqlClient.datastore.NO_MORE_RESULTS) {
            next_link = `${API_URL}/cargo?cursor=${next_cursor}`;
        }

        const page = {
            items: entities,
            next: next_link
        }

        return page;
    }

    /**
     * create a new cargo object in the datastore
     */
    public async createCargo(_weight: number, _content: string, _delivery_date: string)
        : Promise<string | IError> {
        const newData: ICargoPrototype = {
            weight: _weight,
            content: _content,
            delivery_date: _delivery_date,
            carrier: null
        }

        let newKey = await this.nosqlClient.datastoreSave(CARGO, newData);

        /**
         * create live link and update entity in datastore
         */
        Object.assign(newData, { id: `${newKey.id}` });
        Object.assign(newData, { self: `${API_URL}/${CARGO}/${newKey.id}` });

        const newCargo = {
            key: newKey,
            data: newData
        }

        /**
         * update with live link and id
         */
        await this.nosqlClient.datastoreUpsert(newCargo);

        return newKey;
    }

    /**
     * delete cargo from datastore
     */
    public async deleteCargo(cargoId: string): Promise<any> {
        return this.nosqlClient.datastoreDelete(CARGO, cargoId)
            .then(() => {
                for (let deleteCallback of this.deleteCallbacks)
                    deleteCallback(cargoId);
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

    public handleBoatDeleted = async (boatId: string): Promise<any | IError> => {
        let allCargo = await this.getAllCargo() as ICargoResult[];
        if (!isError(allCargo)) {
            for (let cargo of allCargo) {
                if (cargo.carrier !== null && cargo.carrier.id == boatId) {
                    let noted = await this.editCargo(cargo.id, {
                        carrier: null
                    })
                }
            }
        } else {
            let error = allCargo;
            return error;
        }
    }
}