import collections from '../config/mongoCollections';
import { ObjectId } from 'mongodb'; 
import { checkObjectId, checkDate, checkNonEmptyString } from '../helpers/error';
import { ApplicationObject, ContactObject, CycleObject, EventObject, MediaObject, UserObject } from '../typings';

export default {
    /**
     * Get event by id
     * @param {string} cycleId
     * @param {string} applicationId
     * @param {string} eventId
     * @returns {Promise<Object>} The event given the ids above
     */
    getEventById: async (cycleId: string, applicationId: string, eventId: string):Promise<Object> => {
        
        if(!checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(!checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(!checkObjectId(eventId)){
            throw new Error('Invalid eventId');
        }

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId){
                application = element;
            }
        }
        if(application === null) throw new Error('Could not find application');

        let event = null;
        for(let element of application.events){
            if(element._id.toString() === eventId){
                event = element
            }
        }
        if(event === null) throw new Error('Could not find event');

        return event;
    },

    /**
     * Get all events
     * @param {string} cycleId
     * @param {string} applicationId
     * @returns {Promise<Object[]>}All the events of the application
     */
    getAllEvents: async (cycleId: string, applicationId: string): Promise<Object[]> => {

        if(!checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(!checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId){
                application = element;
                break;
            }
        }
        if(application === null) throw new Error('Could not find application');
        
        let events = application.events ? application.events : [];

        return events
    },

    /**
     * Create event
     * @param {string} cycleId
     * @param {string} applicationId
     * @param {string} title 
     * @param {Date} date 
     * @param {String} location 
     * @returns {Promise<object>} if the event was created, throws otherwise 
     */
    createEvent: async (cycleId: string, applicationId: string, title: string, date: string, location: string): Promise<object> => {

        if(!checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
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


        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        const newEvent: EventObject = {
            _id: new ObjectId(),
            status: false,
            title: title,
            date: new Date(date), // Potential bugs here if date is passed as '1/1/22' i know 'January 1 2022' works
            location: location
        }

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId){
                application = 1;
                break;
            } 
        }
        if(application === null) throw new Error('Could not find application');
        
        let updateInfo = await cyclesCollection.update(
            {
            _id: new ObjectId(cycleId),
            "applications._id": new ObjectId(applicationId)
            }, 
            {$push: {
                "applications.$.events": newEvent
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not add event');

        return exports.default.readById(cycleId, applicationId, newEvent._id);
    },

    /**
     * Update event
     * @param {string} cycleId 
     * @param {string} applicationId 
     * @param {string} eventId
     * @param {object} eventObject can contain: {title: string, date: Date, location: string}
     */
    updateEvent: async (cycleId: string, applicationId: string, eventId: string, eventObject: object): Promise<object> => {

        if(!checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(!checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(!checkObjectId(eventId)){
            throw new Error('Invalid eventId');
        }

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        //find the application
        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId){
                application = element;
                break;
            } 
        }
        if(application === null) throw new Error('Could not find application');

        //find the event
        let updateEvent = null;
        for(let element of application.events){
            if(element._id.toString() === eventId){
                updateEvent = element
            }
        }
        if(updateEvent === null) throw new Error('Could not find event');


        //update the event
        for(let attribute in eventObject){
            if(attribute in updateEvent){
                updateEvent[attribute] = eventObject[attribute];
            } else {
                throw new Error('Invalid event attribute');
            }
        }

        //update the events list
        let events = [];
        for(let element of application.events){
            if(element._id.toString() === eventId){
                events.push(updateEvent);
            }
            events.push(element);
        }

        //update mongodb with new events list
        let updateInfo = await cyclesCollection.update(
            {
            _id: new ObjectId(cycleId),
            "applications._id": new ObjectId(applicationId)
            }, 
            {$set: {
                "applications.$.events": events
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not update event');

        return exports.default.readById(cycleId, applicationId, eventId);
    },

    /**
     * Delete event
     * @param {string} cycleId 
     * @param {string} applicationId 
     * @param {string} eventId 
     * @returns true if the event was deleted, throws otherwise
     */
    deleteEvent: async (cycleId: string, applicationId: string, eventId: string): Promise<boolean> => {

        if(!checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(!checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(!checkObjectId(eventId)){
            throw new Error('Invalid eventId');
        }

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId){
                application = element;
                break;
            } 
        }
        if(application === null) throw new Error('Could not find application');

        let events = [];
        for(let element of application.events){
            if(element._id.toString() === eventId){
                continue;
            }
            events.push(element);
        }
        if(events.length === application.events.length) throw new Error('Could not find event');
        
        let updateInfo = await cyclesCollection.update(
            {
            _id: new ObjectId(cycleId),
            "applications._id": new ObjectId(applicationId)
            }, 
            {$set: {
                "applications.$.events": events
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not remove event');

        return true;
    }
}
