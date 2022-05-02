import { getCycleByID, getUserById } from '../data';
import { CycleObject, UserObject } from '../typings';

export * from './error';

/**
 * @description checks whether the given application id is attached to the current user's current cycle.
 * @param {string} userId string representing the ObjectId of the user logged in
 * @param {string} applicationId string representing the requested application id
 * @returns {boolean} denoting whether the application id is attached to the user.
 */
export const isUsersApplication = async (userId: string, applicationId: string, cycleId?: string): Promise<boolean> => {

    let userCycle: CycleObject;
    if(!cycleId) {
        let user: UserObject;
        try {
            user = await getUserById(userId);
        } catch(e) {
            return false;
        }

        try {
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

    if(userCycle.applications.findIndex(app => app._id.toString() === applicationId) === -1)
        return false;

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