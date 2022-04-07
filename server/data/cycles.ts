import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';

export default {

    /**
     * @description Get a cycle by id
     * @param {string} id Cycle id
     * @returns {Promise<Object>} Cycle object
     */
    readById: async (id: string): Promise<object> => {
        // TODO: Error handling

        const cycleCollection = await cycles();
        const cycle = await cycleCollection.findOne({_id: new ObjectId(id)});
        if(cycle === null)
            throw new Error("There is no cycle with that id.");

        cycle['_id'] = cycle['_id'].toString();
        return cycle;
    },

    /**
     * @description Get all cycles for a given user
     * @param userId User id
     * @returns List of cycles
     */
    readAll: async (userId: string): Promise<object[]> => {
        // TODO: Error handling

        const cycleCollection: any = await cycles();
        const userCollection: any = await users();
        const user: any = await userCollection.findOne({
            _id: new ObjectId(userId) });
        if(user === null)
            throw new Error("There is no user with that id.");

        let userCycles: object[] = [];
        for(let i = 0; i < user.cycles.length; i++) {
            const cycle = await cycleCollection.findOne({
                _id: new ObjectId(user.cycles[i]) });
            cycle['_id'] = cycle['_id'].toString();
            userCycles.push(cycle);
        }
        return userCycles;
    },

    /**
     * @description Create a new cycle
     * @param userId User id
     * @returns The newly created cycle object
     */
    create: async (userId: string): Promise<object> => {
        // TODO: Error handling
        let currDate: Date = new Date();
        let cycle: object = {
            startDate: currDate,
            endDate: null,
            applications: []
        }

        // Add to cycles document
        const cycleCollection: any = await cycles();
        const userCollection: any = await users();
        const insertInfo = await cycleCollection.insertOne(cycle);
        if(insertInfo.insertedCount === 0) {
            throw new Error("Could not add cycle.");
        }

        // Finish previous cycle if unfinished
        const newId = insertInfo.insertedId;
        const user = await userCollection.findOne({
            _id: new ObjectId(userId) });
        if(user === null) {
            throw new Error("There is no user with that id.");
        } else if(user.cycles.slice(-1)[0].endDate === null) {
            user.cycles[user.cycles.length - 1].endDate = currDate;
        }

        // Add to user's cycles list
        user.cycles.push(newId.toString());
        const updateInfo = await userCollection.updateOne({
            _id: new ObjectId(userId) }, {
                $set: { cycles: user.cycles }
            });
        if(updateInfo.modifiedCount === 0) {
            throw new Error("Could not add cycle to user.");
        }

        // Return the new cycle object
        const newCycle = await cycleCollection.findOne({ _id: newId });
        newCycle['_id'] = newCycle['_id'].toString();
        return newCycle;
    },

    /**
     * Finishes a cycle by setting its end date to the current date.
     * @param cycleId Cycle id
     * @returns The updated cycle object
     */
    finishCycle: async (cycleId: string): Promise<object> => {
        // TODO: Error handling

        // Retrieve the cycle
        const cycleCollection: any = await cycles();
        const cycle = await cycleCollection.findOne({
            _id: new ObjectId(cycleId) });
        if(cycle === null) {
            throw new Error("There is no cycle with that id.");
        }

        // Update the end date
        const updateInfo = await cycleCollection.updateOne({
            _id: new ObjectId(cycleId) }, {
                $set: { endDate: new Date() }
        });
        if(updateInfo.modifiedCount === 0) {
            throw new Error("Could not finish cycle.");
        }

        // Return the updated cycle object
        const newCycle = await cycleCollection.findOne({
             _id: new ObjectId(cycleId) });
        newCycle['_id'] = newCycle['_id'].toString();
        return newCycle;
    }
}