import { Controller } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";
import { ShipsModel } from "@models/ships.model";


export class UsersController extends Controller {
    private shipsModelRef: ShipsModel = ShipsModel.Instance;

    constructor() {
        super();
    }

    public handleGet = async (request: IRequest): Promise<any | IError> => {
        
        // TODO: GET /users/:userid/ships should return all ships owned
        //      by :userid provided the JWT supplied in the matches 
        //      :userid
        //       - You do not need to implement any of the parent 
        //          routes (e.g. You do not need to implement GET 
        //          /users)

        // TODO: authorize
        let result = await this.shipsModelRef.getShipsForUser(request.params.user_id);
        return result;
    }

    public handlePost = async (request: IRequest): Promise<any | IError> => {
        // TODO: method to post a new user?
    }

    public handleDelete = async (request: IRequest): Promise<any | IError> => {
        // TODO: delete user handler?
    }
}