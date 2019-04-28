import { SlipsModel, ISlipResult } from "@models/slips.model";
import { Controller } from "@controllers/controller";
import { IError, ErrorTypes } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";

/**
 * validates and processes input for the model
 */
export class SlipsController extends Controller {
    private slipsModel: SlipsModel;

    constructor() { 
        super();

        /** grab handle to slips model singleton */
        this.slipsModel = SlipsModel.Instance;
    }

    /** called by router when a get request received for slips resource */
    public async handleGet(request: IRequest): Promise<object | IError> {
        let result = {};
        if (!request.params.slip_id) {
            result = await this.slipsModel.getAllSlips();
        } else {
            result = await this.slipsModel.getSlipById(request.params.slip_id);
        }
        return result;
    }

    /** called by router when a post request received for slips resource */
    public async handlePost(request: IRequest): Promise<any | IError> {
        if (!this.slipsModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE };
        } else if (!(await this.slipsModel.numberUnique(request.body.number))) {
            return <IError>{ error_type: ErrorTypes.NOT_UNIQUE };
        } else {
            /** create boat and return */
            let newKey = await this.slipsModel.createSlip(request.body.number);
            return newKey;
        } 
    }

    /** called by router when a put request received for slips resource */
    public async handlePut(request: IRequest): Promise<any | IError> {
        /** validate request */
        if (request.params.slip_id && request.params.boat_id) {
            /** construct edit from request */
            let docked = await this.slipsModel.dockBoatAtSlip(
                request.params.slip_id, request.params.boat_id);
            return docked;
        } else return <IError>{ error_type: ErrorTypes.BAD_EDIT }
    }

    /** called by router when a patch request received for slips resource */
    public async handlePatch(request: IRequest): Promise<any | IError> {
        if (request.params.slip_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);
            let edited = await this.slipsModel.editSlip(request.params.slip_id, edit);
            return edited;
        } else return <IError>{ error_type: ErrorTypes.BAD_EDIT }
    }   
    
    /** called by router when a delete request received for slips resource */
    public async handleDelete(request: IRequest): Promise<object | IError> {
        if (request.params.slip_id) {
            if (request.params.boat_id) {
                let evacuated = await this.slipsModel.evacuateFromSlip(
                    request.params.slip_id, request.params.boat_id);
                return evacuated;
            } else {
                /** return confirmation to route handler */
                let deleteConfirmed = await this.slipsModel.deleteSlip(request.params.slip_id);
                return deleteConfirmed;
            }
        } else return <IError> { error_type: ErrorTypes.NO_ID }
    }

    /** build edit object (used for patching) */
    private buildEditFromRequest(_request: IRequest): object {
        const _edit = {};
        if (_request.body.number)
            Object.assign(_edit, { number: _request.body.number });
        if (_request.body.current_boat)
            Object.assign(_edit, { current_boat: _request.body.current_boat })
        if (_request.body.arrival_date)
            Object.assign(_edit, { arrival_date: _request.body.arrival_date })
        return _edit;
    }
}