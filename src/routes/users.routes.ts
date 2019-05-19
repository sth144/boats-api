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
    }
}