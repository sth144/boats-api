import { ShipsModel, IShipPrototype } from "@models/ships.model";
import { Controller } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";
import { AuthenticationService } from "@base/authentication/authentication.service";

/**
 * validates and processes input for the model
 */
export class ShipsController extends Controller {
    /** grab handle to ship model singleton */
    private shipsModel: ShipsModel = ShipsModel.Instance;;
    private authenticator: AuthenticationService = AuthenticationService.Instance;

    constructor() { 
        super();
    }

    /** called by router when a get request is received for ships resource */
    public handleGet = async (request: IRequest): Promise<any | IError> => {
        // TODO: GET /ships should display ALL ships regardless 
        //      of credentials provided

        // TODO: GET /users/:userid/ships should return all ships 
        //      owned by :userid provided the JWT supplied in the 
        //      matches :userid
        //       - You do not need to implement any of the parent 
        //          routes (e.g. You do not need to implement GET 
        //          /users)

        let result = {};

        if (!request.params.ship_id) {
            /** all ships selected */
            result = this.shipsModel.getAllShips();
        } else {
            /** one ship selected */
            // TODO: authorize
            result = await this.shipsModel.getShipById(request.params.ship_id);
        }
        return result;
    }

    /** called by router when a post request received for ships resource */
    public handlePost = async (request: IRequest): Promise<any | IError> => {
        // TODO: POST /ships with a valid JWT should create a ship 
        //      with the owner assigned to the account named in the JWT
        
        // TODO: POST /ships without any credentials or with invalid 
        //      credentials should return a 401 Unauthorized status

            // TODO: authorize
        if (!this.shipsModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE };
        } else if (!(await this.shipsModel.nameUnique(request.body.name))) {
            return <IError>{ error_type: ErrorTypes.NOT_UNIQUE }
        } else {
            /** create and return ship */
            // TODO: will owner be passed in body or params?
            let newKey = await this.shipsModel.createShip(
                request.body.name, request.body.type, request.body.length, request.body.owner);
            return newKey;
        }
    }

    /** called by router when delete request received for ships resource */
    public handleDelete = async (request: IRequest): Promise<object | IError> => {
        // TODO: Only the owner of a ship with the proper credentials 
        //      should be able to DELETE ships

        // TODO: 401 status should be returned for missing or invalid 
        //      JWTs, 403 if a non-owner tries to delete a ship

        if (request.params.ship_id) {
            let deleteConfirmed
                = await this.shipsModel.deleteShip(request.params.ship_id);
            return deleteConfirmed;
        } return <IError>{ error_type: ErrorTypes.NOT_FOUND }
        // TODO: correct error codes
    }
}