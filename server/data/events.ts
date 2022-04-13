import collections from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { ApplicationObject, ContactObject, CycleObject, EventObject, MediaObject, UserObject } from '../typings';

export default {
    /**
     * Get event by id
     * @param {ObjectId} cycleId
     * @param {ObjectId} applicationId
     * @param {ObjectId} eventId
     * @returns {Promise<object>} The event given the ids above
     */
    readById: async (cycleId: ObjectId, applicationId: ObjectId, eventId: ObjectId):Promise<object> => {

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId.toString()){
                application = element;
            }
        }
        if(application === null) throw new Error('Could not find application');

        let event = null;
        for(let element of application.events){
            if(element._id.toString() === eventId.toString()){
                event = element
            }
        }
        if(event === null) throw new Error('Could not find event');

        event._id = event._id.toString();
        return event;
    },

    /**
     * Get all events
     * @param {ObjectId} cycleId
     * @param {ObjectId} applicationId
     * @returns {Promise<object[]>}All the events of the application
     */
    readAll: async (cycleId: ObjectId, applicationId: ObjectId): Promise<object[]> => {

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId.toString()){
                application = element;
                break;
            }
        }
        if(application === null) throw new Error('Could not find application');
        
        let events = application.events.map((element) => element.toString());

        return events
    },

    /**
     * Create event
     * @param {ObjectId} cycleId 
     * @param {string} title 
     * @param {Date} date 
     * @param {String} location 
     * @returns {Promise<object>} if the event was created, throws otherwise 
     */
    create: async (cycleId: ObjectId, applicationId: ObjectId, title: string, date: Date, location: string): Promise<object> => {

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        const newEvent: EventObject = {
            _id: new ObjectId(),
            status: false,
            title: title,
            date: date,
            location: location
        }

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId.toString()){
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
     * @param {ObjectId} cycleId 
     * @param {ObjectId} applicationId 
     * @param {ObjectId} eventId
     * @param {object} eventObject can contain: {title: string, date: Date, location: string}
     */
    update: async (cycleId: ObjectId, applicationId: ObjectId, eventId: ObjectId, eventObject: object): Promise<object> => {


        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        //find the application
        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId.toString()){
                application = element;
                break;
            } 
        }
        if(application === null) throw new Error('Could not find application');

        //find the event
        let updateEvent = null;
        for(let element of application.events){
            if(element._id.toString() === eventId.toString()){
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
            if(element._id.toString() === eventId.toString()){
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
     * @param {ObjectId} cycleId 
     * @param {ObjectId} applicationId 
     * @param {ObjectId} eventId 
     * @returns true if the event was deleted, throws otherwise
     */
    delete: async (cycleId: ObjectId, applicationId: ObjectId, eventId: ObjectId): Promise<boolean> => {

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        let application = null;
        for(let element of cycle.applications){
            if(element._id.toString() === applicationId.toString()){
                application = element;
                break;
            } 
        }
        if(application === null) throw new Error('Could not find application');

        let events = [];
        for(let element of application.events){
            if(element._id.toString() === eventId.toString()){
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
