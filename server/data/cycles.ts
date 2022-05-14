import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId } from '../helpers/error';
import { CycleObject, UserObject } from '../typings';

/**
 * @description Get a cycle by id
 * @param {string} id Cycle id
 * @returns {Promise<CycleObject>} Cycle object
 */
export const getCycleByID = async (id: string): Promise<CycleObject> => {
    if(!checkObjectId(id))
        throw new Error('Invalid id');

    const cycleCollection = await cycles();
    const cycle: CycleObject = await cycleCollection.findOne({ _id: new ObjectId(id) });
    if(cycle === null) throw new Error("There is no cycle with that id.");

    return cycle;
};

/**
 * @description Get all cycles for a given user
 * @param userId User id
 * @returns {Promise<Array<CycleObject>>} List of cycles
 */
export const getAllCycles = async (userId: string): Promise<Array<CycleObject>> => {
    if(!checkObjectId(userId))
        throw new Error('Invalid id');

    const userCollection = await users();
    const user: UserObject = await userCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleCollection = await cycles();
    let userCycles: Array<CycleObject> = [];
    for(let i = 0; i < user.cycles.length; i++)
        userCycles.push(await cycleCollection.findOne({ _id: new ObjectId(user.cycles[i]) }));
    
    return userCycles;
};

/**
 * @description Create a new cycle
 * @param {string} userId User id
 * @returns {{Promise<CycleObject>}} The newly created cycle object
 */
export const createCycle = async (userId: string): Promise<CycleObject> => {
    if(!checkObjectId(userId))
        throw new Error('Invalid id');

    const currDate: Date = new Date();
    const cycle: CycleObject = {
        _id: new ObjectId(),
        startDate: currDate,
        endDate: null,
        applications: []
    };

    // Add to cycles document
    const cycleCollection = await cycles();
    const insertInfo = await cycleCollection.insertOne(cycle);
    if(insertInfo.insertedCount === 0)
        throw new Error("Could not add cycle.");

    // Finish previous cycle if unfinished
    const newId: ObjectId = insertInfo.insertedId;
    const userCollection = await users();
    const user: UserObject = await userCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    if(user.cycles.length > 0) {
        const currCycle: CycleObject = await cycleCollection.findOne({
            _id: new ObjectId(user.cycles[user.cycles.length - 1])
        });
        if(currCycle.endDate === null) await finishCycle(userId);
    }

    // Add to user's cycles list
    user.cycles.push(newId);
    const updateInfo = await userCollection.updateOne(
        { _id: new ObjectId(userId) }, 
        { $set: { cycles: user.cycles } }
    );
    if(updateInfo.modifiedCount === 0)
        throw new Error("Could not add cycle to user.");

    // Return the new cycle object
    return await getCycleByID(newId.toString());
};

/**
 * @description Finishes a cycle by setting its end date to the current date.
 * @param {string} userId User id
 * @returns {{Promise<CycleObject>}} The updated cycle object
 */
export const finishCycle = async (userId: string): Promise<CycleObject> => {
    if(!checkObjectId(userId))
        throw new Error('Invalid id');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleId: ObjectId = user.cycles[user.cycles.length-1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error("User has no cycles.");

    // Update the end date
    const updateInfo = await cyclesCollection.updateOne(
        { _id: cycleId },
        { $set: { endDate: new Date() } }
    );
    if(updateInfo.modifiedCount === 0)
        throw new Error("Could not finish cycle.");

    // Return the updated cycle object
    return await getCycleByID(cycleId.toString());
};