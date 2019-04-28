/**
 * base controller class
 */
export abstract class Controller {
    constructor() { }

    abstract async handleGet(request: object): Promise<object>;
    abstract async handlePost(request: object): Promise<object>;
    abstract async handlePatch(request: object): Promise<object>;
    abstract async handleDelete(request: object): Promise<object>;

    /** handlePut optional */
    // abstract async handlePut(request);
}