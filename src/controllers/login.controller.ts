import { WriteOnlyController } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";
import { ShipsModel } from "@models/ships.model";


export class LoginController extends WriteOnlyController {
    private shipsModelRef: ShipsModel = ShipsModel.Instance;

    constructor() {
        super();
    }

    public handlePost = async (request: IRequest): Promise<any | IError> => {
        // TODO: post handler for login
    }
}