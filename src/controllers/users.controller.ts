import { ReadOnlyController } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";


export class UsersController extends ReadOnlyController {

    constructor() {
        super();
    }

    public handleGet = async (request: IRequest): Promise<any | IError> => {
        // TODO: implement this endpoint
        
        return 
    }
}