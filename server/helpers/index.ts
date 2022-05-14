import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { getCycleByID, getUserByEmail, getUserById } from '../data';
import { CycleObject, UserObject } from '../typings';
import { checkNonEmptyString } from './error';

export * from './error';

/**
 * @description checks whether the given application id is attached to the current user's current cycle.
 * @param {string} userId string representing the ObjectId of the user logged in
 * @param {string} applicationId string representing the requested application id
 * @returns {Promise<boolean>} denoting whether the application id is attached to the user.
 */
export const isUsersApplication = async (userId: string, applicationId: string, cycleId?: string):
                                                                                Promise<boolean> => {
    let userCycle: CycleObject;
    if(!cycleId) {
        try {
            const user: UserObject = await getUserById(userId);
            userCycle = await getCycleByID(user.cycles[user.cycles.length -1].toString());
        } catch(e) {
            return false;
        }
    } else {
        try {
            userCycle = await getCycleByID(cycleId);
        } catch(e) {
            return false;
        }
    }

    if(userCycle.applications.findIndex(app => app._id.toString() === applicationId) === -1) return false;

    return true;
};

/**
 * @description Generates a random color and returns it as a string value
 * ref: https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-11.php
 * @returns {string} the hex code of the color
 */
export const randomColor = (): string => {
   let n = (Math.random() * 0xfffff * 1000000).toString(16);
   return '#' + n.slice(0, 6);
};

/**
 * @description validates the bearer token for the user in case the express session expired (mostly a heroku issue).
 * @param {string} token the JWT of the firebase user 
 * @returns {Promise<{ _id: string; email: string; }>} the data to store in session.
 */
export const getSession = async (token: string): Promise<{ _id: string; email: string; }> => {
    if(!token || !checkNonEmptyString(token))
            throw new Error("auth token is invalid.");
            
    token = token.split('JWT ')[1];
    let email: string;
    try {
        ({ email } = await getAuth().verifyIdToken(token));
    } catch(e) {
        throw new Error("invalidated session. could not authenticate.");
    }

    let id: ObjectId;
    try { // ensure user is in the database
        ({ _id: id } = await getUserByEmail(email));
    } catch(e) {
        throw new Error("user does not exist in the database.");
    }

    return { _id: id.toString(), email };
};