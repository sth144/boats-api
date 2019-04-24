import { IRequest } from "@lib/request.interface";

export abstract class RouterWrapper {
    protected constructor() { }

    protected abstract setupRoutes(): void;
    protected abstract handleError(err, req: IRequest, res): Promise<void>;
}