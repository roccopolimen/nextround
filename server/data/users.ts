import { ObjectId } from 'mongodb';
import { cycles, users } from '../config/mongoCollections';
import { checkEmail, checkNonEmptyString, checkObjectId, checkURL } from '../helpers';
import { UserObject } from '../typings';

/**
 * @description Get a user with a specific firebase id.
 * @param {string} id the user's id.
 * @return {Promise<UserObject>} A user, if one exists with the given id.
 */
export const getUserById = async (id: string): Promise<UserObject> => {
    if(!id || !checkObjectId(id))
        throw new Error("[data/users getById] id is invalid.");

    const userCollection = await users();
    const user: UserObject = await userCollection.findOne({ _id: new ObjectId(id) });
    if(user === null)
        throw new Error("[data/users getById] no user with that id.");
    return user;
};

/**
 * @description Get a user with a specific email.
 * @param {string} email the user's email
 * @return {Promise<UserObject>} the user. fails if no user with given email.
 */
export const getUserByEmail = async (email: string): Promise<UserObject> => {
    if(!email || !checkEmail(email))
        throw new Error("[data/users getByEmail] email is invalid.");

    const userCollection = await users();
    const user: UserObject = await userCollection.findOne({ email: email });
    if(user === null)
        throw new Error("[data/users getByEmail] no user with that email.");
    return user;
};

/**
 * @description Adds a new user.
 * @param {string} firebaseId The firebase id the user logged in with
 * @param {string} email The email the user logged in with
 * @param {string} name the user's display name
 * @return {Promise<UserObject>} The new user object.
 */
export const createUser = async (firebaseId: string, email: string, name: string): Promise<UserObject> => {
    if(!firebaseId || !checkNonEmptyString(firebaseId))
        throw new Error("[data/users create] firebaseId is invalid.");

    if(!email || !checkEmail(email))
        throw new Error("[data/users create] email is invalid.");

    if(!name || !checkNonEmptyString(name))
        throw new Error("[data/users create] name is invalid.");

    let alreadySeen: boolean = false;
    try {
        await getUserByEmail(email);
        alreadySeen = true;
    } catch(e) {}

    if(alreadySeen)
        throw new Error("[data/users create] user already exists with credentials.");

    const newUser = {
        _id: new ObjectId(),
        email: email,
        name: name,
        pfp: "",
        firebaseId: firebaseId,
        cycles: []
    };

    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if(insertInfo.insertedCount === 0)
        throw new Error("[data/users create] could not add user.");
    
    return await getUserById(newUser._id.toString());
};

/**
 * @description Update the user's profile 
 * @param {string} id the user's id.
 * @param {string} email The email the user logged in with
 * @param {string} name the user's display name
 * @param {string} pfp the user's profile picture (default null)
 * @return {Promise<UserObject>} A user, if one exists with the given id.
 */
export const updateUser = async (id: string, email: string, name: string, pfp: string): Promise<UserObject> => {
    if(!id || !checkObjectId(id)) throw new Error("[data/users updateUser] id is invalid.");
    if(!email || !checkEmail(email)) throw new Error("[data/users updateUser] email is invalid.");
    if(!name || !checkNonEmptyString(name)) throw new Error("[data/users updateUser] name is invalid.");
    if(!pfp || !checkNonEmptyString(pfp) || !checkURL(pfp)) throw new Error("[data/users updateUser] pfp link is invalid.");

    const origUser: UserObject = await getUserById(id);
    if (!origUser) throw new Error("[data/users updateUser] no user with that id found")

    const otherUser: UserObject =  await getUserByEmail(email);
    if (otherUser != null) throw new Error ("[data/users updateUser] a user with that email already exists")

    let userUpdateInfo = {
        _id: id,
        email: email,
        name: name,
        pfp: pfp,
        firebaseId: origUser.firebaseId,
        cycles: origUser.cycles
    }

    // check at least one input is different
    if (
        userUpdateInfo.email === origUser.email &&
        userUpdateInfo.name === origUser.name &&
        userUpdateInfo.pfp === origUser.pfp
      ) throw new Error ("[data/users updateUsser] at least one field must be different")

    // update user
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: id },
        { $set: userUpdateInfo }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) 
        throw new Error ("[data/users updateUsser] could not update user")

    return await getUserById(id);
};

/**
 * @description Delete the user from the user's collection
 * @param {string} id the id of the user
 * @return {boolean} true if it was successful
 */
export const removeUser = async (id: string): Promise<boolean> => {
    if(!id || !checkObjectId(id))
        throw new Error("[data/users remove] id is invalid.");

    const userCollection = await users();
    const user: UserObject = await getUserById(id);

    const user_cycles: Array<ObjectId> = user.cycles;
    const cycleCollection = await cycles();
    for(let cycleId of user_cycles)
        await cycleCollection.deleteOne({ _id: cycleId });

    // TODO: delete social media posts as well??
    // Discuss this during standup.

    const deleteInfo = await userCollection.deleteOne({ _id: new ObjectId(id) });
    if(deleteInfo.deletedCount === 0)
        throw new Error("[data/users remove] could not delete user.");

    return true;
};