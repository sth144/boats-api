import { Model } from "./model";
import { IBoatRef } from "./slips.model";
import { ExecSyncOptionsWithStringEncoding } from "child_process";

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

export class CargoModel extends Model {


    constructor() {
        super();
    }
}