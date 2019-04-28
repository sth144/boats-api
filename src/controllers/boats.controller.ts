import { BoatsModel, IBoatPrototype } from "@models/boats.model";
import { Controller } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";

/**
 * validates and processes input for the model
 */
// TODO: implement pagination
export class BoatsController extends Controller {
    private boatsModel: BoatsModel;

    constructor() { 
        super();

        /** grab handle to boat model singleton */
        this.boatsModel = BoatsModel.Instance;
    }

    /** called by router when a get request is received for boats resource */
    public async handleGet(request: IRequest): Promise<any | IError> {
        let result = {};
        if (!request.params.boat_id) {
            /** handle case where all boats selected */
            result = await this.boatsModel.getAllBoats();
        } else {
            /** handle case where one boat selected */
            result = await this.boatsModel.getBoatById(request.params.boat_id)
        }
        return result;
    }

    /** called by router when a post request received for boats resource */
    public async handlePost(request: IRequest): Promise<any | IError> {
        /** enforce data model */
        if (!this.boatsModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE };
        } else if (!(await this.boatsModel.nameUnique(request.body.name))) {
            return <IError>{ error_type: ErrorTypes.NOT_UNIQUE }
        } else {
            /** create and return boat */
            let newKey = await this.boatsModel.createBoat(
                request.body.name, request.body.type, request.body.length);
            return newKey;
        }
    }

    /** called by router when a patch request received for boats resource */
    public async handlePatch(request: IRequest): Promise<object | IError> {
        if (request.params.boat_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);

            let editConfirmed = await this.boatsModel.editBoat(request.params.boat_id, edit);
            return editConfirmed;
        } else return <IError>{ error_type: ErrorTypes.NO_ID }
    }   
    
    /** called by router when delete request received for boats resource */
    public async handleDelete(request: IRequest): Promise<object | IError> {
            /** confirm id in request */
        if (request.params.boat_id) {
            /** 
             * return confirmation to route handler 
             *  - BoatsModel handles notification of SlipsModel using callback
             */
            let deleteConfirmed 
                = await this.boatsModel.deleteBoat(request.params.boat_id);
            return deleteConfirmed;
        } else return <IError>{ error_type: ErrorTypes.NO_ID }
    }

    /** construct an edit object to pass to model (used for patching) */
    private buildEditFromRequest(_request: IRequest): object {
        const _edit = {};
        if (_request.body.name)
            Object.assign(_edit, { name: _request.body.name });
        if (_request.body.type)    
            Object.assign(_edit, { type: _request.body.type });
        if (_request.body.length)
            Object.assign(_edit, { length: _request.body.length });
        return _edit;
    }
}