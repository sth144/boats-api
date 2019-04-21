export class SlipsController {

    constructor() { }

    public getSlip() {
        // You should be able to either view a single entity or the entire collections of entities, 
        // for example, I should be able to view the details of a single boat as well as get a list 
        // of all boats
        // When viewing a boat or slip, the response should include a live link (url) to view said 
        // boat or slip. (Please review how Gist results have a url field that contains a complete url)

        // If a slip is occupied, the response must include a live link (url) to the occupying boat

        //const query = this.datastoreRef
        //    .createQuery("slip")
    }

    public createSlip(data) {
        // All newly created slips should be empty

        //const query = this.datastoreRef.save({
        //    key: this.datastoreRef.key("slip"),
        //    data: <ISlip>{

        //    }
        //})
        //return query
    }

    public deleteSlip() {
        // When deleting a slip, any boat that was occupying said slip is now considered "at sea"
    }

    public editSlip() {
        // You should be able to modify any property except for the ID
    }
}