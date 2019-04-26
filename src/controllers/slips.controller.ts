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
        this.slipsModel = SlipsModel.Instance;
    }

    public async handleGet(request: IRequest): Promise<object | IError> {
        // TODO: You should be able to either view a single entity or the entire collections of entities, 
        //  for example, I should be able to view the details of a single boat as well as get a list 
        //  of all boats
        //  When viewing a boat or slip, the response should include a live link (url) to view said 
        //  boat or slip. (Please review how Gist results have a url field that contains a complete url)

        // TODO: If a slip is occupied, the response must include a live link (url) to the occupying boat
        let result = {};
        if (!request.params.slip_id) {
            result = await this.slipsModel.getAllSlips();
        } else {
            result = await this.slipsModel.getSlipById(request.params.slip_id);
        }
        return result;
    }

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

    public async handlePut(request: IRequest): Promise<any | IError> {
        /** validate request */
        if (request.params.slip_id && request.params.boat_id) {
            /** construct edit from request */
            let docked = await this.slipsModel.dockBoatAtSlip(
                request.params.slip_id, request.params.boat_id);
            return docked;
        } else return <IError>{ error_type: ErrorTypes.BAD_EDIT }
    }

    public async handlePatch(request: IRequest): Promise<any | IError> {
        // TODO: You should be able to modify any property except for the ID 

        /** TODO: validate request */
        if (request.params.slip_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);
            let edited = await this.slipsModel.editSlip(request.params.slip_id, edit);
            return edited;
        } else return <IError>{ error_type: ErrorTypes.BAD_EDIT }
    }   
    
    public async handleDelete(request: IRequest): Promise<object | IError> {
        if (request.params.slip_id) {
            if (request.params.boats && request.params.boat_id) {
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