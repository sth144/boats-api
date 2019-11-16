import { BoatsModel, IBoatPrototype } from "@models/boats.model";
import { Controller } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";
import { Formats } from "@lib/formats.interface";

/**
 * validates and processes input for the model
 */
export class BoatsController extends Controller {
    private boatsModel: BoatsModel = BoatsModel.Instance;

    constructor() { 
        super();
    }

    /** called by router when a get request is received for boats resource */
    public handleGet = async (request: IRequest): Promise<any | IError> => {
        let result = {};
        console.log("hanlding gat");
        console.log(request.query)

        //if (request.headers.accept !== Formats.JSON 
        //    && request.headers.accept !== Formats.HTML
        //    && request.headers.accept !== undefined) {
        //    return <IError>{ error_type: ErrorTypes.BAD_MEDIA_TYPE }
        //}

        if (!request.params.boat_id) {
            /** handle case where all boats selected */
            if (request.query.pag && request.query.pag == "false") {
                console.log("getting all")
                result = await this.boatsModel.getAllBoats();
            } else {
                let _cursor = undefined
                if (request.query.cursor) {
                    _cursor = request.query.cursor.replace(/ /g, "+");
                } 
                result = await this.boatsModel.getAllBoatsPaginated(_cursor);   
            }
        } else {
            /** handle case where one boat selected */
            if (request.path.search("cargo") > -1) {
                let _cursor = null;
                if (request.query.cursor) {
                    _cursor = request.query.cursor.replace(/ /g, "+");
                }
                result = await this.boatsModel.getBoatCargo(request.params.boat_id, _cursor);
            } else {
                let format: string;
                if (request.headers.accept !== undefined ) format = request.headers.accept;
                else format = Formats.JSON;
                result = await this.boatsModel.getBoatById(request.params.boat_id, format)
            }
        }
        return result;
    }

    /** called by router when a post request received for boats resource */
    public handlePost = async (request: IRequest): Promise<any | IError> => {
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
    public handlePatch = async (request: IRequest): Promise<object | IError> => {
        if (request.params.boat_id) {
            /** construct edit from request */
            const edit = this.buildEditFromRequest(request);

            let editConfirmed = await this.boatsModel.editBoat(request.params.boat_id, edit);
            return editConfirmed;
        } return <IError>{ error_type: ErrorTypes.NO_ID }
    }   
    
    public handlePut = async(request: IRequest): Promise<object | IError> => {
        if (!request.params.boat_id) {
            return <IError>{ error_type: ErrorTypes.METHOD_NOT_ALLOWED }
        } 
        if (request.params.cargo_id) {
            let onBoard = await this.boatsModel.putCargoOnBoat(
                request.params.boat_id, request.params.cargo_id);
            return onBoard;
        } else {
            /** redirect to patch handler */
            let patched = await this.handlePatch(request);
            return patched;
        }
    }     

    /** called by router when delete request received for boats resource */
    public handleDelete = async (request: IRequest): Promise<object | IError> => {
        /** confirm id in request */
        if (request.params.boat_id) {
            if (request.params.cargo_id) {
                /** remove cargo from boat */
                let evacuated = await this.boatsModel.removeCargoFromBoat(
                    request.params.boat_id, request.params.cargo_id);
                return evacuated;
            } else {
                /** 
                 * return confirmation to route handler 
                 *  - BoatsModel handles notification of SlipsModel using callback
                 */
                let deleteConfirmed 
                    = await this.boatsModel.deleteBoat(request.params.boat_id);
                return deleteConfirmed;
            }
        } return <IError>{ error_type: ErrorTypes.METHOD_NOT_ALLOWED }
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