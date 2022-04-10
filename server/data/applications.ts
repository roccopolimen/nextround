import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
// import { errors } from '../helpers/error';

export default {
    
    /**
     * @description Get an application by id
     * @param {string} cycleId Cycle id
     * @param {string} appId Application id
     * @returns {Promise<object>} Cycle object with given id if found 
     * and throws an error otherwise
     */
    readById: async (cycleId: string, appId: string): Promise<object> => {
        //TODO error checking

        //Finds cycle with cycleId
        const cycleCollection: any = await cycles();
        const cycle = await cycleCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) {
            throw new Error("There is no cycle with that id.");
        }

        //Finds application with appId inside of cycle
        let retApp: object = null;
        for(let app of cycle["applications"]) {
            if(appId === app["_id"].toString()) {
                app["_id"] = app["_id"].toString();
                retApp = app;
            }
        }

        if(retApp === null) {
            throw new Error("No application found with that id.")
        } else {
            return retApp;
        }

        
    },

    /**
     * @description Finds all applications from a given cycle
     * @param {string} cycleId The cycle id to get all applications from
     * @returns {Promise<object[]>} Array of applications belonging to a given cycle,
     * otherwise throws and error
     */
    readAll: async (cycleId: string): Promise<object[]> => {
        //TODO error checking

        //Find the cycle with cycleId
        const cycleCollection: any = await cycles();
        const cycle: any = await cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        });
        if(cycle === null) {
            throw new Error("There is no cycle with that id.");
        }

        //Grabs all applicatins in cycle 
        const cycleApps: object[] = cycle["applications"];
        let retApps: Array<object> = []; 
        for(let app of cycleApps) {
            app["_id"] = app["_id"].toString();
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
     * @returns {Promise<object>} Returns the created application object if successful anf throws
     * and error otherwise
     */
    create: async (cycleId: string, company: string, position: string, location: string,
        salary: number, jobPostUrl: string, cardColor: string, description: string):
        Promise<object> => {
        //TODO error checking
        
        //Unsure of how the logo is getting stored if we are using that auto logo finder
        let newApp: object = {
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
        const cycle: object = await cycleCollection.findOne({
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

        //Re-finds the newly updated cycle with cycleId
        const upCycle: object = cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        });
        
        //Returns the newest application from cycle
        if(upCycle === null) {
            throw new Error("There is no cycle with this id.")
        } else {
            const retApp: object = upCycle["applications"].slice(-1)[0];
            retApp["_id"] = retApp["_id"].toString();
            return retApp;
        }

    },

    /**
     * Updates a given application with new data
     * @param {string} cycleId Cycle the application is in
     * @param {string} appId Id of application to change
     * @param {object} appObject An application object that can contain any subset of 
     * application attributes to allow for PUT and POST opperations
     * @returns {Promise<object>} Returns the updated application if successful and 
     * throws an error otherwise
     */
    update: async (cycleId: string, appId: string, appObject: object): Promise<object> => {
        //TODO error checking

        //Finds the cycle with cycleId
        const cycleCollection: any = await cycles();
        let cycle: object = cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        })

        //Finds the position of the application with appId
        let app: object = null;
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

        //Re-finds the newly updated cycle
        const upCycle: object = cycleCollection.findOne({
            _id: new ObjectId(cycleId)
        });
        
        //Returns the updated application object
        if(upCycle === null) {
            throw new Error("There is no cycle with this id.")
        } else {
            const retApp: object = upCycle["applications"][appPos];
            retApp["_id"] = retApp["_id"].toString();
            return retApp;
        }
    },

    /**
     * Deletes an application from a given cycle
     * @param {string} cycleId Cycle the application is in
     * @param {string} appId Application to be deleted
     * @returns {Promise<boolean>} Returns true if application was successfully deleted and 
     * throws an error otherwise
     */
    delete: async (cycleId: string, appId: string): Promise<boolean> => {
        //TODO error checking

        //Finds the cycle with cycleId
        const cycleCollection: any = await cycles();
        let cycle: object = cycleCollection.findOne({
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