import * as Express from "express";
import { RouterWrapper } from "@routes/router.wrapper";
import { UsersController } from "@controllers/users.controller";

export class UsersRouterWrapper extends RouterWrapper {
    private static _instance: UsersRouterWrapper;
    public static get Instance(): UsersRouterWrapper {
        if (!this._instance) this._instance = new UsersRouterWrapper();
        return this._instance;
    }

    public usersRouter: Express.Router;
    private usersController: UsersController;

    private constructor() {
        super();
        this.usersRouter = Express.Router();
        this.usersController = new UsersController();
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        // TODO: GET /users/:userid/ships should return all ships owned
        //      by :userid provided the JWT supplied in the matches 
        //      :userid
        //       - You do not need to implement any of the parent 
        //          routes (e.g. You do not need to implement GET 
        //          /users)

        this.usersRouter.get("/:user_id/ships", async (req, res) => {
            this.directRequest(req, res, this.usersController.handleGet, (req, res, result) => {
                // TODO: authorize in controller
                res.status(200).send(result);
            })
        });
    }
}