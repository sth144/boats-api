import { NoSqlClient } from "@db/nosql.client";
import { Model } from "@models/model";
import { IError, ErrorTypes, isError } from "@lib/error.interface";
import { IBoatResult, BoatsModel, BOATS } from "@models/boats.model";
import { API_URL } from "@routes/urls";

/**
 * interface used to create and insert slip objects into the google-cloud
 *  datastore
 * @property id             unique datastore identifier (not supplied by client)
 * @property number         human readable unique identifier
 * @property current_boat   boat reference for current boat, id null if empty, contains self link
 * @property arrival_date   date that current boat arrived (timestamp)
 * @property self           live link to self
 */
export interface ISlipPrototype {
    id?: string,            
    number: number,             
    current_boat?: IBoatRef, 
    arrival_date?: string,  
    self?: string,          
}

/**
 * used to validate objects retrieved from datastore
 */
export interface ISlipResult {
    id: string,
    number: number,
    arrival_date: string,
    self: string
    current_boat: IBoatRef
}

export interface IBoatRef {
    id: string,
    self: string,
    name?: string
}

export const SLIPS = "slips";

/**
 * manages construction, editing, and deletion of slip objects from
 *  datastore
 */
export class SlipsModel extends Model {
    /**
     * singleton instance
     */
    private static _instance: SlipsModel;
    public static get Instance(): SlipsModel {
        if (!this._instance) this._instance = new SlipsModel();
        return this._instance;
    }

    protected nosqlClient: NoSqlClient;
    private boatsModelRef: BoatsModel;

    constructor() { 
        super();
        this.nosqlClient = NoSqlClient.Instance;

        this.boatsModelRef = BoatsModel.Instance;
        this.boatsModelRef.registerDeleteCallback(this.handleBoatDeleted)

        console.log("SlipsModel initialized");
    }

    /**
     * ensure number supplied in POST request is unique
     */
    public async numberUnique(_testNumber: number): Promise<boolean> {
        /** get all numbers */
        let allSlips = await this.getAllSlips() as ISlipResult[];
        if (!isError(allSlips)) {
            /** check against each number */
            for (let slip of allSlips) 
                if (_testNumber == slip.number) 
                    return false;
        }
        /** number is unique */
        return true;
    }

    /**
     * confirm that POST request conforms to insertion interface
     */
    public confirmInterface(obj: any): boolean {
        /** only number will be supplied when creating a new slip */
        if (!("number" in obj) || !(typeof obj.number == "number")) {
            return false;
        } return true;
    }

    /**
     * confirm slip exists
     */
    public async slipExistsById(_id: string): Promise<boolean> {
        let result = await this.getSlipById(_id);
        if (isError(result)) return false;
        return true;
    }

    /** 
     * retrieve slip by id
     */
    public async getSlipById(slipId: string): Promise<ISlipResult | IError> {
        let slip = await this.nosqlClient.datastoreGetById(SLIPS, slipId);
        if (slip == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return slip;
    }

    /**
     * retrieve entire collection (all slips)
     */
    public async getAllSlips(): Promise<ISlipResult[] | IError> {
        let allSlips = await this.nosqlClient.datastoreGetCollection(SLIPS);
        if (allSlips == undefined) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        return allSlips
    }

    /**
     * create a new slip in the datastore
     */
    public async createSlip(_number: number): Promise<any> {
        const newData: ISlipPrototype = {
            number: _number,
            current_boat: null,
            arrival_date: null      
        }

        let newKey = await this.nosqlClient.datastoreSave(SLIPS, newData);

        /** 
         * create live link and update entity in datastore
         */
        Object.assign(newData, { id: `${newKey.id}` });
        Object.assign(newData, { self: `${API_URL}/${SLIPS}/${newKey.id}` })

        const newSlip = {
            key: newKey,
            data: newData
        }

        /**
         * update with live link and id
         */
        await this.nosqlClient.datastoreUpsert(newSlip);

        return newKey;
    }

    /** 
     * delete a slip from the datastore
     */
    public async deleteSlip(slipId: string): Promise<any> {
        let deleted = await this.nosqlClient.datastoreDelete(SLIPS, slipId);
        return deleted;
    }

    /** 
     * edit an existing slip
     */
    public async editSlip(slipId: string, editSlip: Partial<ISlipPrototype>) {
        if (await this.slipExistsById(slipId)) {
            let edited = await this.nosqlClient.datastoreEdit(SLIPS, slipId, editSlip);
            return edited;
        } else return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }

    /** 
     * dock an existing boat at an existing slip
     */
    public async dockBoatAtSlip(slipId: string, boatId: string)
        : Promise<any | IError> {
        const date: string = (new Date).toString();
        /**
         * check if boat is docked somewhere else
         * check if slip is occupied
         */
        let allSlips = await this.getAllSlips();
        if (!isError(allSlips)) {
            let slipExists = false, boatDockedElsewhere = false, slipOccupied = false;
            let dockedAtSlip = null;
            for (let _slip of (allSlips as ISlipResult[])) {
                if (_slip.id == slipId) {
                    slipExists = true;
                    if (_slip.current_boat != null && _slip.current_boat.id != boatId) {
                        return <IError>{ error_type: ErrorTypes.FORBIDDEN }
                    }
                } else if (_slip.current_boat.id == boatId) {
                    boatDockedElsewhere = true;
                    dockedAtSlip = _slip.id;
                }
            }
            if (!slipExists) return <IError>{ error_type: ErrorTypes.NOT_FOUND }
            if (boatDockedElsewhere) {
                await this.evacuateSlip(dockedAtSlip);
            }
            let docked = await this.editSlip(slipId, {
                current_boat: {
                    id: boatId,
                    self: `${API_URL}/${BOATS}/${boatId}`
                },
                arrival_date: date
            });        
            
            return docked;
        } else return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }

    /** 
     * evacuate a specific boat from a slip
     */
    public async evacuateFromSlip(slipId: string, boatId: string)
        : Promise<any | IError> {
        let slip = await this.getSlipById(slipId) as ISlipResult;
        if (!isError(slip)) {
            let boat = await this.boatsModelRef.getBoatById(boatId) as IBoatResult;
            if (!isError(boat) && (slip.current_boat.id == boat.id)) {
                let evacuated = await this.evacuateSlip(slipId);
                return evacuated;
            }
        }
        return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }

    /** 
     * evacuate a slip without specifying boat id 
     */
    private async evacuateSlip(slipId: string): Promise<any> {
        let edited = this.editSlip(slipId, {
            current_boat: null
        });
        return edited;
    }

    /** 
     * callback to be registered with boats model. Called when a boat is 
     *  deleted to evacuate the appropriate slip if necessary
     */
    private handleBoatDeleted = async (boatId: string): Promise<any | IError> => {
        let allSlips = await this.getAllSlips() as ISlipResult[];
        if (!isError(allSlips)) {
            for (let slip of allSlips) {
                if (slip.current_boat.id == boatId) {
                    let slipId = await this.nosqlClient.getIdFromData(slip)
                    let evacuated = await this.evacuateSlip(slipId);
                    return evacuated;
                }
            }
        } else {
            let error = allSlips; 
            return allSlips;
        }
    }
}
