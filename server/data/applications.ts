import { cycles } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId, checkNonEmptyString, checkPositiveNumber } from '../helpers/error';
import colors from '../public/index';

export default {
    
    /**
     * @description Get an application by id
     * @param {string} cycleId Cycle id
     * @param {string} appId Application id
     * @returns {Promise<Object>} Cycle Object with given id if found 
     * and throws an error otherwise
     */
    getApplicationById: async (cycleId: string, appId: string): Promise<Object> => {
        if(!cycleId || !checkObjectId(cycleId)) {
            throw new Error("A proper cycle id must be provided.");
        }

        if(!appId || !checkObjectId(appId)) {
            throw new Error("A proper application id must be provided.");
        }

        //Finds cycle with cycleId
        const cycleCollection: any = await cycles();
        const cycle = await cycleCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) {
            throw new Error("There is no cycle with that id.");
        }

        //Finds application with appId inside of cycle
        let retApp: Object = null;
        for(let app of cycle["applications"]) {
            if(appId === app["_id"].toString()) {
                retApp = app;
            }
        }

        if(retApp === null) {
            throw new Error("No application found with that id.")
        }
        
        return retApp;
    },

    /**
     * @description Finds all applications from a given cycle
     * @param {string} cycleId The cycle id to get all applications from
     * @returns {Promise<Object[]>} Array of applications belonging to a given cycle,
     * otherwise throws and error
     */
    getAllApplications: async (cycleId: string): Promise<Object[]> => {
        if(!cycleId || !checkObjectId(cycleId)) {
            throw new Error("a proper cycle id must be provided.")
        }

        //Find the cycle with cycleId
        const cycleCollection: any = await cycles();
        const cycle: any = await cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        });

        if(cycle === null) {
            throw new Error("There is no cycle with that id.");
        }

        //Grabs all applicatins in cycle 
        const cycleApps: Object[] = cycle["applications"];
        let retApps: Array<Object> = []; 
        for(let app of cycleApps) {
            retApps.push(app);
        }

        return retApps;
    },

    /**
     * Creates a new application within a given cycle
     * @param {string} cycleId The cycle to add the application to
     * @param {string} company Company the application is for
     * @param {string} position Position beign applied to
     * @param {string} location Location being applied to
     * @param {number} salary Position salary 
     * @param {string} jobPostUrl URL the application was found at
     * @param {string} cardColor Chosen color of application card
     * @param {string} description Application description
     * @returns {Promise<Object>} Returns the created application Object if successful anf throws
     * and error otherwise
     */
    createApplication: async (cycleId: string, company: string, position: string, location: string,
        salary: number, jobPostUrl: string, description: string):
        Promise<Object> => {
        if(!cycleId || !checkObjectId(cycleId)) {
            throw new Error("A proper cycle id must be provided.");
        }

        if(!company || !checkNonEmptyString(company)) {
            throw new Error("A company name must be provided.");
        }

        if(!position || !checkNonEmptyString(position)) {
            throw new Error("A position name must be provided.");
        }

        if(!location || !checkNonEmptyString(location)) {
            throw new Error("A location must be provided.");
        }

        if(!salary || !checkPositiveNumber(salary)) {
            throw new Error("A salary must be provided.");
        }
        if(!jobPostUrl || !checkNonEmptyString(jobPostUrl)) {
            throw new Error("An application url must be provided.");
        }

        if(!description || !checkNonEmptyString(description)) {
            throw new Error("A description must be provided.");
        }

        const cardColor = colors[Math.floor(Math.random() * colors.length)];
        
        //TODO - Add logo typing
        //Unsure of how the logo is getting stored if we are using that auto logo finder
        let newApp: Object = {
            _id: new ObjectId(),
            company: company,
            position: position,
            logo: null,
            location: location,
            salary: salary, 
            jobPostUrl: jobPostUrl,
            cardColor: cardColor,
            description: description,
            progress: 0,
            notes: [],
            events: [],
            contacts: []
        }

        //Finds the cycle with cycleId
        const cycleCollection: any = await cycles();
        const cycle: Object = await cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        });
        if(cycle === null) {
            throw new Error("There is no cycle with this id.")
        }

        //Adds the newly created application to the cycle
        cycle["applications"] = cycle["applications"].push(newApp);
        let updatedInfo = await cycleCollection.updateOne({_id: new ObjectId(cycleId)}, {$set: cycle});
        if(updatedInfo.modifiedCount === 0) {
            throw new Error("Could not update cycle with new application.");
        }

        return newApp;

    },

    /**
     * Updates a given application with new data
     * @param {string} cycleId Cycle the application is in
     * @param {string} appId Id of application to change
     * @param {Object} appObject An application Object that can contain any subset of 
     * application attributes to allow for PUT and POST opperations
     * @returns {Promise<Object>} Returns the updated application if successful and 
     * throws an error otherwise
     */
    updateApplication: async (cycleId: string, appId: string, appObject: Object): Promise<Object> => {
        if(!cycleId || !checkObjectId(cycleId)) {
            throw new Error("A proper cycle id must be provided.")
        }

        if(!appId || !checkObjectId(appId)) {
            throw new Error("A proper application id must be provided.");
        }

        if(!appObject) {
            throw new Error("An Object with attributes to update must be provided.");
        }

        //Finds the cycle with cycleId
        const cycleCollection: any = await cycles();
        let cycle: Object = cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        })

        //Finds the position of the application with appId
        let app: Object = null;
        let appPos: number = null;
        for(let x=0; x<cycle["applications"].length; x++) {
            if(cycle["applications"][x]["_id"].toString() === appId) {
                app = cycle["applications"][x];
                appPos = x;
                break;
            }
        }
        if(app === null) {
            throw new Error("Unable to find an application with that id.");
        }

        //Updates the new attributed from appObject to app
        for(let attribute in appObject) {
            if(attribute in app) {
                if(appObject[attribute] === null) {
                    throw new Error("Cannot update with null value");
                }
                app[attribute] = appObject[attribute];
            } else {
                throw new Error("Invalid application attribute given.");
            }
        }

        //Changes the cycle and then updates it in the database
        cycle["applications"][appPos] = app;
        let updatedInfo = await cycleCollection.updateOne({_id: new ObjectId(cycleId)}, {$set: cycle});
        if(updatedInfo.modifiedCount === 0) {
            throw new Error("Could not update application.");
        }

        return app;
    },

    /**
     * Deletes an application from a given cycle
     * @param {string} cycleId Cycle the application is in
     * @param {string} appId Application to be deleted
     * @returns {Promise<boolean>} Returns true if application was successfully deleted and 
     * throws an error otherwise
     */
    deleteApplication: async (cycleId: string, appId: string): Promise<boolean> => {
        if(!cycleId || !checkObjectId(cycleId)) {
            throw new Error("a proper cycle id must be provided.")
        }

        if(!appId || !checkObjectId(appId)) {
            throw new Error("A proper application id must be provided.");
        }

        //Finds the cycle with cycleId
        const cycleCollection: any = await cycles();
        let cycle: Object = cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        })

        //Finds position of the application to be deleted
        let appPos: number = null;
        for(let x=0; x<cycle["applications"].length; x++) {
            if(cycle["applications"][x]["_id"].toString() === appId) {
                appPos = x;
                break;
            }
        }
        if(appPos === null) {
            throw new Error("Unable to find an application with that id.");
        }

        //Slices the cycle application array to remove application with appId
        cycle["applications"] = cycle["applications"].splice(appPos, 1);
        let updatedInfo = await cycleCollection.updateOne({_id: new ObjectId(cycleId)}, {$set: cycle});
        if(updatedInfo.modifiedCount === 0) {
            throw new Error("Could not update application.");
        }

        return true;
    }
}