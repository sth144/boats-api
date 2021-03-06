import { Controller } from "./controller";
import { IRequest } from "@lib/request.interface";
import { IError, ErrorTypes } from "@lib/error.interface";
import { CargoModel } from "@models/cargo.model";


/**
 * validates and processes input for the model
 */
export class CargoController extends Controller {
    private cargoModel: CargoModel = CargoModel.Instance;

    constructor() {
        super();
    }

    /** called by router when a get request is received for cargo resource */
    public handleGet = async (request: IRequest): Promise<IError | any> => {
        let result = {};
        if (!request.params.cargo_id) {
            /** all cargo selected */
            if (request.query.pag && request.query.pag == "false") {
                result = await this.cargoModel.getAllCargo();
            } else {
                let _cursor = undefined;
                if (request.query.cursor) {
                    _cursor = request.query.cursor.replace(/ /g, "+");
                }
                result = await this.cargoModel.getAllCargoPaginated(_cursor);
            }
        } else {
            /** one particular cargo item selected */
            result = await this.cargoModel.getCargoById(request.params.cargo_id);
        }
        return result;
    }

    /** called by router when a post request received for cargo resource */
    public handlePost = async (request: IRequest): Promise<IError | any> => {
        /** enforce data model */
        if (!this.cargoModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE }
        } else {
            /** create and return key to new cargo */
            let newKey = await this.cargoModel.createCargo(
                request.body.weight, request.body.content, request.body.delivery_date);
            return newKey;
        }
    }

    /** called by router when a patch request received for cargo resource */
    public handlePatch = async (request: IRequest): Promise<IError | any> => {
        if (request.params.cargo_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);

            let editConfirmed = await this.cargoModel.editCargo(
                request.params.cargo_id, edit);
            return editConfirmed;
        } return <IError>{ error_type: ErrorTypes.NO_ID };        
    }

    /** called by router when delete request received for for cargo resource */
    public handleDelete = async (request: IRequest): Promise<IError | any> => {
        /** confirm id in request */
        if (request.params.cargo_id) {
            /**
             * return confirmation to route handler
             *  
             */
            let deleteConfirmed
                = await this.cargoModel.deleteCargo(request.params.cargo_id)    
            return deleteConfirmed;
        } return <IError>{ error_type: ErrorTypes.NO_ID }
    }

    /** construct edit object to pass to model (for patching) */
    private buildEditFromRequest(_request: IRequest): object {
        const _edit = {};
        if (_request.body.weight)
            Object.assign(_edit, { weight: _request.body.weight });
        if (_request.body.content)
            Object.assign(_edit, { content: _request.body.content });
        if (_request.body.delivery_date)
            Object.assign(_edit, { delivery_date: _request.body.delivery_date });
        return _edit;
    }
}