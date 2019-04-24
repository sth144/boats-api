import { BoatsModel, IBoat } from "@models/boats.model";

// TODO: implement Controller base class
/**
 * validates and processes input for the model
 */
export class BoatsController {
    private boatsModel: BoatsModel;

    constructor() { 
        this.boatsModel = new BoatsModel();
    }

    public async handleGet(request) {
        // You should be able to either view a single entity or the entire collections of entities, 
        // for example, I should be able to view the details of a single boat as well as get a list 
        // of all boats
        // When viewing a boat or slip, the response should include a live link (url) to view said 
        // boat or slip. (Please review how Gist results have a url field that contains a complete url)

        console.log("handle get boats");
        console.log(request.query);

        /** TODO: handle case where all boats selected */

        /** TODO: handle case where one boat selected */

        /** validate */

        return await this.boatsModel.getBoatsById([request.query.id])
    }

    public async handlePost(request) {
        // TODO: integrate body-parser

        // All newly created boats should start "At sea" and not in a slip
        console.log("handle post boats");
        console.log(request.body);

        /** enforce data model */
        if (BoatsModel.isIBoat(request.body)) {
            console.log("It's a boat!");
        } else console.log("no dice");

        /** enforce data model member types */

        /** ensure name is unique */

        /** build object to pass to model */
        let newBoat: IBoat = {
            name: request.body.name,
            type: request.body.type,
            length: request.body.length
        }

        /** create boat */
        let result = await this.boatsModel.createBoat(newBoat);

        /** return id */
        console.log("result");
        console.log(result);
    }

    public async handlePut(request) {
        console.log("handle put boats");
        console.table(request);
    }

    public async handlePatch(request) {
        // You should be able to modify any property except for the ID
        console.log("handle patch boats");
        console.table(request);
    }   
    
    public async handleDelete(request) {
        // Deleting a boat should empty the slip the ship was previously in automatically
        console.log("handle delete boats");
        console.table(request);
    }
}