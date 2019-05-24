import { ShipsModel, IShipPrototype, IShipResult } from "@models/ships.model";
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
        let result = {};

        if (!request.params.ship_id) {
            /** all ships selected */
            result = this.shipsModel.getAllShips();
        } else {
            /** one ship selected */
            result = await this.shipsModel.getShipById(request.params.ship_id);
        }
        return result;
    }

    /** called by router when a post request received for ships resource */
    public handlePost = async (request: IRequest): Promise<any | IError> => {
        if (!this.shipsModel.confirmInterface(request.body)) {
            return <IError>{ error_type: ErrorTypes.INTERFACE };
        } else if (!(await this.shipsModel.nameUnique(request.body.name))) {
            return <IError>{ error_type: ErrorTypes.NOT_UNIQUE }
        } else {
            /** create and return ship */
            let newKey = await this.shipsModel.createShip(
                request.body.name, request.body.type, request.body.length, request.body.owner);
            return newKey;
        }
    }

    /** called by router when delete request received for ships resource */
    public handleDelete = async (request: IRequest): Promise<object | IError> => {
        /**
         * only the owner of a ship can delete it (username must match owner, and jwt must
         *  be correct)
         */


        if (request.params.ship_id) {
            /** check jwt matches request username */
            const decoded = AuthenticationService.Instance.decodeJwt(request.headers.authorization);
            const nameShouldBe = decoded.name;

            if (request.params.username == nameShouldBe) {
                /** check ship owner */
                const ship_info = await this.shipsModel.getShipById(request.params.ship_id) as IShipResult;
                
                if (ship_info.owner == nameShouldBe) {
                    let deleteConfirmed
                        = await this.shipsModel.deleteShip(request.params.ship_id);
                    return deleteConfirmed;
                } 
            } return <IError>{ error_type: ErrorTypes.FORBIDDEN }
            /** returns code 403 if non-owner has tried to delete */
        } return <IError>{ error_type: ErrorTypes.NOT_FOUND }
    }
}