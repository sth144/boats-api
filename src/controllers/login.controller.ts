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
        // TODO: login route takes user name and password to retrieve jwt token
        const username = request.body.username;
        const password = request.body.password;
        const options = {
            method: "POST",
            url: `https://dev-hdtedn05.auth0.com/oauth/token`, // TODO: oauth endpoint?
            headers: { "content-type": "application/json" },
            body: {
                grant_type: "password",
                username: username,
                password: password,

                connection: "Username-Password-Authentication",
                /** 
                 * not concerned with security in this example, issues using environment
                 *  variables on gcloud
                 */
                client_id: process.env.CLIENT_ID,  // TODO: client id
                client_secret: process.env.CLIENT_SECRET,
            },
            json: true
        };
        return options;
    }
}