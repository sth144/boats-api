import { IRequest } from "@lib/request.interface";

export abstract class RouterWrapper {
    handleError: Function;

    protected constructor() { }

    protected abstract setupRoutes(): void;
    public attachErrorCallback(_errorHandler: Function): void {
        this.handleError = _errorHandler;
    }
}