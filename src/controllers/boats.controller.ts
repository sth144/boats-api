import { BoatsModel, IBoat } from "@models/boats.model";
import { Controller } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";

/**
 * validates and processes input for the model
 */
export class BoatsController extends Controller {
    private boatsModel: BoatsModel;

    constructor() { 
        super();
        this.boatsModel = BoatsModel.Instance;
    }

    public async handleGet(request: IRequest): Promise<object> {
        // TODO: You should be able to either view a single entity or the entire collections of entities, 
        //  for example, I should be able to view the details of a single boat as well as get a list 
        //  of all boats
        // TODO: When viewing a boat or slip, the response should include a live link (url) to view said 
        //  boat or slip. (Please review how Gist results have a url field that contains a complete url)

        let result = {};

        if (!request.params.boat_id) {
            /** handle case where all boats selected */
            result = await this.boatsModel.getAllBoats();
        } else {
            /** handle case where one boat selected */
            result = await this.boatsModel.getBoatById(request.query.id)
        }

        return result;
    }

    public async handlePost(request: IRequest): Promise<any | IError> {
        /** enforce data model */
        if (!this.boatsModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE };
        } else if (!this.boatsModel.nameUnique(request.body.name)) {
            return <IError>{ error_type: ErrorTypes.UNIQUE }
        } else {
            /** create and return boat */
            return await this.boatsModel.createBoat(
                request.body.name, request.body.type, request.body.length);
        }
    }

    public async handlePatch(request: IRequest): Promise<object | IError> {
        /** TODO: You should be able to modify any property except for the ID */
        if (request.params.boat_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);

            return this.boatsModel.editBoat(request.params.boat_id, edit);
        } else return <IError>{ error_type: ErrorTypes.BAD_EDIT }
    }   
    
    public async handleDelete(request: IRequest): Promise<object | IError> {
        /** parse id from request */
        const _id = request.params.boat_id;


        /** 
         * return confirmation to route handler 
         *  - BoatsModel handles notification of SlipsModel using callback
         */
        return await this.boatsModel.deleteBoat(_id);
    }

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