import { Controller } from "./controller";
import { IRequest } from "@lib/request.interface";
import { IError, ErrorTypes } from "@lib/error.interface";
import { CargoModel } from "@models/cargo.model";


/**
 * validates and processes input for the model
 */
// TODO: implement pagination
export class CargoController extends Controller {
    private cargoModel: CargoModel;

    constructor() {
        super();

        /** grab handle to cargo model singleton */
        this.cargoModel = CargoModel.Instance;
    }

    /** called by router when a get request is received for cargo resource */
    public async handleGet(request: IRequest): Promise<IError | any> {
        let result = {};
        if (!request.params.cargo_id) {
            /** all cargo selected */
            result = await this.cargoModel.getAllCargo();
        } else {
            /** one particular cargo item selected */
            result = await this.cargoModel.getCargoById(request.params.cargo_id);
        }
        return result;
    }

    /** called by router when a post request received for cargo resource */
    public async handlePost(request: IRequest): Promise<IError | any> {
        /** enforce data model */
        if (!this.cargoModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE }
        }   // TODO: anything need to be unique?
        else {
            /** create and return key to new cargo */
            let newKey = await this.cargoModel.createCargo(
                // TODO: call method
            );
            return newKey;
        }
    }

    /** called by router when a patch request received for cargo resource */
    public async handlePatch(request: IRequest): Promise<IError | any> {
        if (request.params.cargo_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);

            let editConfirmed = await this.cargoModel.editCargo(
                request.params.cargo_id, edit);
            return editConfirmed;
        } return <IError>{ error_type: ErrorTypes.NO_ID };        
    }

    /** called by router when delete request received for for cargo resource */
    public async handleDelete(request: IRequest): Promise<IError | any> {
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
        // TODO: build edit

        return _edit;
    }
}