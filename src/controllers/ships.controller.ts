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
    private ShipsModel: ShipsModel = ShipsModel.Instance;;
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

    }

    /** called by router when a post request received for ships resource */
    public handlePost = async (request: IRequest): Promise<any | IError> => {
        // TODO: POST /ships with a valid JWT should create a ship 
        //      with the owner assigned to the account named in the JWT
        
        // TODO: POST /ships without any credentials or with invalid 
        //      credentials should return a 401 Unauthorized status
    }

    /** called by router when delete request received for ships resource */
    public handleDelete = async (request: IRequest): Promise<object | IError> => {
        // TODO: Only the owner of a ship with the proper credentials 
        //      should be able to DELETE ships

        // TODO: 401 status should be returned for missing or invalid 
        //      JWTs, 403 if a non-owner tries to delete a ship
        return;
    }
}