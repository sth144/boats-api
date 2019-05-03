import { NoSqlClient } from "@db/nosql.client";
import { Model } from "@models/model";
import { IError, ErrorTypes, isError } from "@lib/error.interface";
import { Datastore, Query } from "@google-cloud/datastore";
import { API_URL } from "@routes/routes.main";
import { ICargoRef, CARGO, CargoModel } from "./cargo.model";

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
    cargo?: ICargoRef[],
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
    cargo: ICargoRef[],
    self: string
}

export interface IBoatsPaginated {
    boats: IBoatResult[],
    next: string
}

export const BOATS = "boats";
export const BOATS_CURSORS = "boats_cursors";

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

    protected nosqlClient: NoSqlClient;
    private cargoModelRef: CargoModel;

    private constructor() { 
        super();        
        this.nosqlClient = NoSqlClient.Instance;
        
        this.cargoModelRef = CargoModel.Instance;
        this.cargoModelRef.registerDeleteCallback(this.handleCargoDeleted);

        this.registerDeleteCallback(this.cargoModelRef.handleBoatDeleted)

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

    public async getBoatCargo(boatId: string): Promise<any> {
        // TODO: It should be possible to view a list of all the cargo 
        //      on a particular boat.
        //      - paginated
    }

    /**
     * retrieve entire collection (all boats)
     */
    public async getAllBoats(): Promise<IBoatResult[] | IError> {
        // TODO: All top level lists of items must implement 
        //    pagination. This means when viewing ALL boats, 
        //      ALL cargo, and cargo for a given boat.
        //    It should display 3 items per page
        //    There should be, at a minimum, "next" links on each page
        let allBoats = await this.nosqlClient.datastoreGetCollection(BOATS);
        if (allBoats == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allBoats;
    }

    public async getAllBoatsPaginated(_cursor?): Promise<any> {
        // TODO: model responsible for pagination
        // TODO: call from controller

        let query: Query = this.nosqlClient.datastore.createQuery(BOATS).limit(3);
        if (_cursor) {
            query = query.start(_cursor);
        }
        const results = await this.nosqlClient.runQueryForModel(query);
        const entities = results[0];
        const info = results[1];
        
        return [entities, info];
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
            cargo: []
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
                for (let deleteCallback of this.deleteCallbacks)
                    deleteCallback(boatId);
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

    public async putCargoOnBoat(boatId: string, cargoId: string)
        : Promise<any | IError> {
        /**
         * check boat exists
         * check if cargo is on another boat
         */
        console.log("PUTTTING " + boatId + " " + cargoId)
        let allBoats = await this.getAllBoats();
        if (allBoats !== undefined && !isError(allBoats)) {
            let boatExists = false, cargoOnOtherBoat = false;
            let boatToPutOn = null;

            console.log("got all boats for put car")
            console.log(allBoats);
            console.log("those are the boats")

            for (let _boat of (allBoats as IBoatResult[])) {
                console.log("cehcking " + JSON.stringify(_boat));
                if (_boat.id == boatId) {
                    console.log("iffing");
                    boatExists = true;
                    boatToPutOn = _boat;
                } else {
                    console.log("elseing");
                    if (_boat.cargo !== undefined && _boat.cargo.length > 0) {
                        for (let _obj of _boat.cargo) {
                            console.log(JSON.stringify(_obj));
                            if (_obj !== null && _obj.id == cargoId) 
                                cargoOnOtherBoat = true;
                        }
                    }
                    if (cargoOnOtherBoat) return <IError>{ error_type: ErrorTypes.FORBIDDEN }
                }
            }
            if (!boatExists) return <IError>{ error_type: ErrorTypes.NOT_FOUND };

            let existingCargo = boatToPutOn.cargo;
            
            console.log("editign");
            let onBoard = await this.editBoat(boatId, {
                cargo: [
                    ...existingCargo, {
                        id: cargoId,
                        self: `${API_URL}/${CARGO}/${cargoId}`
                    }
                ]
            });
            console.log("edted");

            /**
             * set carrier property on cargo
             */
            const cargoUpdated = await this.cargoModelRef.editCargo(cargoId, {
                carrier: {
                    id: boatId,
                    name: boatToPutOn.name,
                    self: boatToPutOn.self
                }
            })

            console.log("updated cargo thing");

            return onBoard;
        } return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }

    public async removeCargoFromBoat(boatId: string, cargoId: string)
        : Promise<any | IError> {
        let boat = await this.getBoatById(boatId) as IBoatResult;
        if (!isError(boat)) {
            let cargo = await this.cargoModelRef.getCargoById(cargoId);
            let boatContainsCargo = false;
            for (let _item of boat.cargo) {
                if (_item.id == cargoId) boatContainsCargo = true;
            }
            if (!isError(cargo) && boatContainsCargo) {
                let updatedBoatCargo = boat.cargo.map(x => {
                    if (x.id != cargoId) return x;
                })
                let removed = await this.editBoat(boatId, {
                    cargo: updatedBoatCargo
                });
                let cargoItemUpdated = await this.cargoModelRef.editCargo(cargoId, {
                    carrier: null
                })
            }
        } return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }

    private handleCargoDeleted = async(cargoId: string): Promise<any | IError> => {
        let allBoats = await this.getAllBoats() as IBoatResult[];
        if (!isError(allBoats)) {
            console.log("cargo deleted, handling");
            for (let boat of allBoats) {
                console.log("checking a boat")
                if (boat.cargo !== undefined) {
                    for (let _item of boat.cargo) {
                        console.log("checking a cargo")
                        if (_item.id == cargoId) {
                            let boatCargoUpdated = boat.cargo.map(x => {
                                if (x.id !== cargoId) return x;
                            })
                            let evacuated = await this.editBoat(boat.id, {
                                cargo: boatCargoUpdated
                            })
                        }
                    }
                }
            }
        } else {
            /** pass on error */
            let error = allBoats;
            return allBoats;
        }
    }
}