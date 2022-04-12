import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId } from '../helpers/error';

/**
 * @description Get a cycle by id
 * @param {string} id Cycle id
 * @returns {Promise<Object>} Cycle object
 */
export const getCycleByID = async (id: string): Promise<Object> => {
    if(!checkObjectId(id)){
        throw new Error('Invalid id');
    }

    const cycleCollection = await cycles();
    const cycle = await cycleCollection.findOne({_id: new ObjectId(id)});
    if(cycle === null)
        throw new Error("There is no cycle with that id.");

    return cycle;
}

/**
 * @description Get all cycles for a given user
 * @param userId User id
 * @returns List of cycles
 */
export const getAllCycles = async (userId: string): Promise<Object[]> => {
    if(!checkObjectId(userId)){
        throw new Error('Invalid id');
    }

    const cycleCollection = await cycles();
    const userCollection = await users();
    const user = await userCollection.findOne({
        _id: new ObjectId(userId) });
    if(user === null)
        throw new Error("There is no user with that id.");

    let userCycles: object[] = [];
    for(let i = 0; i < user.cycles.length; i++) {
        userCycles.push(await cycleCollection.findOne({
            _id: new ObjectId(user.cycles[i]) }));
    }
    return userCycles;
}

/**
 * @description Create a new cycle
 * @param userId User id
 * @returns The newly created cycle object
 */
export const createCycle = async (userId: string): Promise<Object> => {
    if(!checkObjectId(userId)){
        throw new Error('Invalid id');
    }

    let currDate: Date = new Date();
    let cycle: Object = {
        startDate: currDate,
        endDate: null,
        applications: []
    }

    // Add to cycles document
    const cycleCollection = await cycles();
    const userCollection = await users();
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
    return await cycleCollection.findOne({ _id: newId });
}

/**
 * Finishes a cycle by setting its end date to the current date.
 * @param cycleId Cycle id
 * @returns The updated cycle object
 */
export const finishCycle = async (cycleId: string): Promise<Object> => {
    if(!checkObjectId(cycleId)){
        throw new Error('Invalid id');
    }

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
    return await cycleCollection.findOne({
            _id: new ObjectId(cycleId) });
}