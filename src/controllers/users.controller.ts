import { ReadOnlyController } from "@controllers/controller";
import { ErrorTypes, IError } from "@lib/error.interface";
import { IRequest } from "@lib/request.interface";
import { ShipsModel } from "@models/ships.model";
import { AuthenticationService } from "@base/authentication/authentication.service";


export class UsersController extends ReadOnlyController {
    private shipsModelRef = ShipsModel.Instance;

    constructor() {
        super();
    }

    public handleGet = async (request: IRequest): Promise<any | IError> => {
        /**
         * GET /users/:userid/ships returns all shiips owned by userid, provided the supplied
         *  JWT matches userid
         */
        const nameShouldBe = AuthenticationService.Instance.decodeJwt(
            request.headers.authorization).name
        if (request.params.user_id == nameShouldBe) {
            let result = await this.shipsModelRef.getShipsForUser(request.params.user_id);
            return result;
        } return <IError>{ error_type: ErrorTypes.FORBIDDEN }
    }
}