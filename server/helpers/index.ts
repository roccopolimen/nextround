import { getCycleByID, getUserById } from '../data';
import { CycleObject, UserObject } from '../typings';

export * from './error';

/**
 * @description checks whether the given application id is attached to the current user's current cycle.
 * @param {string} userId string representing the ObjectId of the user logged in
 * @param {string} applicationId string representing the requested application id
 * @returns {boolean} denoting whether the application id is attached to the user.
 */
export const isUsersApplication = async (userId: string, applicationId: string): Promise<boolean> => {
    let user: UserObject;
    try {
        user = await getUserById(userId);
    } catch(e) {
        return false;
    }

    let userCycle: CycleObject;
    try {
        userCycle = await getCycleByID(user.cycles[user.cycles.length -1].toString());
    } catch(e) {
        return false;
    }

    if(userCycle.applications.findIndex(app => app._id.toString() === applicationId) === -1)
        return false;

    return true;
};