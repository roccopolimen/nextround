import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb'; 
import { checkObjectId, checkDate, checkNonEmptyString } from '../helpers/error';
import { ApplicationObject, CycleObject, EventObject, UserObject } from '../typings';

/**
 * Get event by id
 * @param {string} userId
 * @param {string} applicationId
 * @param {string} eventId
 * @returns {Promise<EventObject>} The event given the ids above
 */
export const getEventById = async(userId: string, applicationId: string, eventId: string):Promise<EventObject> => {
    
    if(!checkObjectId(userId)){
        throw new Error('Invalid userId');
    }
    if(!checkObjectId(applicationId)){
        throw new Error('Invalid applicationId');
    }
    if(!checkObjectId(eventId)){
        throw new Error('Invalid eventId');
    }

    const usersCollection: any = await users();
    const user: UserObject = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(user === null) throw new Error('Could not find user');

    const cycleId: string = user.cycles[user.cycles.length - 1].toString();

    const cyclesCollection: any = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
    if(cycle === null) throw new Error('Could not find cycle');

    let application: ApplicationObject = null;
    for(let element of cycle.applications){
        if(element._id.toString() === applicationId){
            application = element;
        }
    }
    if(application === null) throw new Error('Could not find application');

    let event: EventObject = null;
    for(let element of application.events){
        if(element._id.toString() === eventId){
            event = element
        }
    }
    if(event === null) throw new Error('Could not find event');

    return event;
}

/**
 * Get all events
 * @param {string} userId
 * @param {string} applicationId
 * @returns {Promise<EventObject[]>}All the events of the application
 */
 export const getAllEvents = async (userId: string, applicationId: string): Promise<EventObject[]> => {

    if(!checkObjectId(userId)){
        throw new Error('Invalid userId');
    }
    if(!checkObjectId(applicationId)){
        throw new Error('Invalid applicationId');
    }

    const usersCollection: any = await users();
    const user: UserObject = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(user === null) throw new Error('Could not find user');

    const cycleId: string = user.cycles[user.cycles.length - 1].toString();

    const cyclesCollection: any = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
    if(cycle === null) throw new Error('Could not find cycle');

    let application: ApplicationObject = null;
    for(let element of cycle.applications){
        if(element._id.toString() === applicationId){
            application = element;
            break;
        }
    }
    if(application === null) throw new Error('Could not find application');
    
    let events: EventObject[] = application.events ? application.events : [];

    return events
}

/**
 * Create event
 * @param {string} userId
 * @param {string} applicationId
 * @param {string} title 
 * @param {Date} date 
 * @param {String} location 
 * @returns {Promise<EventObject>} if the event was created, throws otherwise 
 */
 export const createEvent = async (userId: string, applicationId: string, title: string, date: string, location: string): Promise<EventObject> => {

    if(!checkObjectId(userId)){
        throw new Error('Invalid userId');
    }
    if(!checkObjectId(applicationId)){
        throw new Error('Invalid applicationId');
    }
    if(!checkNonEmptyString(title)){
        throw new Error('Invalid title');
    }
    if(!checkDate(date)){
        throw new Error('Invalid date');
    }
    if(!checkNonEmptyString(location)){
        throw new Error('Invalid location');
    }

    const usersCollection: any = await users();
    const user: UserObject = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(user === null) throw new Error('Could not find user');

    const cycleId: string = user.cycles[user.cycles.length - 1].toString();

    const cyclesCollection: any = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
    if(cycle === null) throw new Error('Could not find cycle');

    const newEvent: EventObject = {
        _id: new ObjectId(),
        status: false,
        title: title,
        date: new Date(date), // Potential bugs here if date is passed as '1/1/22' i know 'January 1 2022' works
        location: location
    }

    // Used to check if application exists 
    let application: number = null;
    for(let element of cycle.applications){
        if(element._id.toString() === applicationId){
            application = 1;
            break;
        } 
    }
    if(application === null) throw new Error('Could not find application');
    
    let updateInfo = await cyclesCollection.updateOne(
        {
        _id: new ObjectId(cycleId),
        "applications._id": new ObjectId(applicationId)
        }, 
        {$push: {
            "applications.$.events": newEvent
            }
        }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not add event');

    return await getEventById(userId, applicationId, newEvent._id.toString());
}

/**
 * Update event
 * @param {string} userId 
 * @param {string} applicationId 
 * @param {string} eventId
 * @param {boolean} status
 * @param {string} title
 * @param {Date} date
 * @param {string} location
 * @returns {Promise<EventObject>} if event  was updated 
 */
 export const updateEvent = async (userId: string, applicationId: string, eventId: string, status: boolean, title: string, date: Date, location: string): Promise<EventObject> => {
    if(!checkObjectId(userId))
        throw new Error('Invalid userId');
    if(!checkObjectId(applicationId))
        throw new Error('Invalid applicationId');
    if(!checkObjectId(eventId))
        throw new Error('Invalid eventId');

    let updateFields: Partial<EventObject> = {};
    if(status !== null) updateFields.status = status;
    if(title) {
        if(!checkNonEmptyString(title))
            throw new Error('Title must be a non-empty string.');
        else
            updateFields.title = title;
    }
    if(date) {
        updateFields.date = date;
    }
    if(location) {
        if(!checkNonEmptyString(location))
            throw new Error('Location must be a non-empty string.');
        else
            updateFields.location = location;
    }

    if(Object.keys(updateFields).length === 0)
        throw new Error('No fields to update in event.');

    const usersCollection: any = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error('Could not find user');

    const cyclesCollection: any = await cycles();
    const cycleId: ObjectId = user.cycles[user.cycles.length - 1];
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error('Could not find cycle');

    const appIndex: number = cycle.applications.findIndex(a => a._id.toString() === applicationId);
    if(appIndex === -1) throw new Error("Unable to find an application with that id.");

    const eventIndex: number = cycle.applications[appIndex].events.findIndex(e => e._id.toString() === eventId);
    if(eventIndex === -1) throw new Error("Unable to find an event on the application with given id.");

    Object.entries(updateFields).forEach(([field, newValue]) => {
        cycle.applications[appIndex].events[eventIndex][field] = newValue;
    });

    // update mongodb with new events list
    let updateInfo = await cyclesCollection.updateOne(
        { _id: cycleId, "applications._id": new ObjectId(applicationId) }, 
        {
            $set: {
                "applications.$.events": cycle.applications[appIndex].events
            }
        }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not update event');

    return await getEventById(userId, applicationId, eventId);
}

/**
 * Delete event
 * @param {string} userId 
 * @param {string} applicationId 
 * @param {string} eventId 
 * @returns true if the event was deleted, throws otherwise
 */
 export const deleteEvent = async (userId: string, applicationId: string, eventId: string): Promise<boolean> => {

    if(!checkObjectId(userId)){
        throw new Error('Invalid userId');
    }
    if(!checkObjectId(applicationId)){
        throw new Error('Invalid applicationId');
    }
    if(!checkObjectId(eventId)){
        throw new Error('Invalid eventId');
    }

    const usersCollection: any = await users();
    const user: UserObject = await usersCollection.findOne({_id: new ObjectId(userId)});
    if(user === null) throw new Error('Could not find user');

    const cycleId: string = user.cycles[user.cycles.length - 1].toString();

    const cyclesCollection: any = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
    if(cycle === null) throw new Error('Could not find cycle');

    let application: ApplicationObject = null;
    for(let element of cycle.applications){
        if(element._id.toString() === applicationId){
            application = element;
            break;
        } 
    }
    if(application === null) throw new Error('Could not find application');

    let events: EventObject[] = [];
    for(let element of application.events){
        if(element._id.toString() === eventId){
            continue;
        }
        events.push(element);
    }
    if(events.length === application.events.length) throw new Error('Could not find event');
    
    let updateInfo = await cyclesCollection.updateOne(
        {
        _id: new ObjectId(cycleId),
        "applications._id": new ObjectId(applicationId)
        }, 
        {$set: {
            "applications.$.events": events
            }
        }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not remove event');

    return true;
}