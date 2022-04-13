import collections from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { ApplicationObject, ContactObject, CycleObject, EventObject, MediaObject, UserObject } from '../typings';

export default {
    /**
     * Get contact by id
     * @param {ObjectId} cycleId
     * @param {ObjectId} applicationId
     * @param {ObjectId} contactId
     * @returns {Promise<object>} The contact given the ids above
     */
    readById: async (cycleId: ObjectId, applicationId: ObjectId, contactId: ObjectId):Promise<object> => {

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

        let contact = null;
        for(let element of application.contacts){
            if(element._id.toString() === contactId.toString()){
                contact = element
            }
        }
        if(contact === null) throw new Error('Could not find contact');

        contact._id = contact._id.toString();
        return contact;
    },

    /**
     * Get all contacts
     * @param {ObjectId} cycleId
     * @param {ObjectId} applicationId
     * @returns {Promise<object[]>}All the contacts of the application
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
        
        let contacts = application.contacts.map((element) => element.toString());

        return contacts
    },

    /**
     * Create contact
     * @param {ObjectId} cycleId 
     * @param {string} title 
     * @param {Date} date 
     * @param {String} location 
     * @returns {Promise<object>} if the contact was created, throws otherwise 
     */
    create: async (cycleId: ObjectId, applicationId: ObjectId, name: string, pronouns: string, location: string, phone: string, email: string): Promise<object> => {

        const cyclesCollection: any = await collections.cycles();
        const cycle = await cyclesCollection.findOne({_id: new ObjectId(cycleId)});
        if(cycle === null) throw new Error('Could not find cycle');

        const newContact: ContactObject = {
            _id: new ObjectId(),
            name: name,
            pronouns: pronouns,
            location: location,
            phone: phone,
            email: email
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
                "applications.$.contacts": newContact
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not add contact');

        return exports.default.readById(cycleId, applicationId, newContact._id);
       
    },

    /**
     * Update contact
     * @param {ObjectId} cycleId 
     * @param {ObjectId} applicationId 
     * @param {ObjectId} contactId
     * @param {object} contactObject can contain: {name: string, pronouns: string, location, phone: string, email: string}
     */
    update: async (cycleId: ObjectId, applicationId: ObjectId, contactId: ObjectId, contactObject: object): Promise<object> => {

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

        //find the contact
        let updateContact = null;
        for(let element of application.contacts){
            if(element._id.toString() === contactId.toString()){
                updateContact = element
            }
        }
        if(updateContact === null) throw new Error('Could not find contact');


        //update the contact
        for(let attribute in contactObject){
            if(attribute in updateContact){
                updateContact[attribute] = contactObject[attribute];
            } else {
                throw new Error('Invalid contact attribute');
            }
        }

        //update the contacts list
        let contacts = [];
        for(let element of application.contacts){
            if(element._id.toString() === contactId.toString()){
                contacts.push(updateContact);
            }
            contacts.push(element);
        }

        //update mongodb with new contacts list
        let updateInfo = await cyclesCollection.update(
            {
            _id: new ObjectId(cycleId),
            "applications._id": new ObjectId(applicationId)
            }, 
            {$set: {
                "applications.$.contacts": contacts
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not update contact');

        return exports.default.readById(cycleId, applicationId, contactId);
        
    },

    /**
     * Delete contact
     * @param {ObjectId} cycleId 
     * @param {ObjectId} applicationId 
     * @param {ObjectId} contactId 
     * @returns true if the contact was deleted, throws otherwise
     */
    delete: async (cycleId: ObjectId, applicationId: ObjectId, contactId: ObjectId): Promise<boolean> => {

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

        let contacts = [];
        for(let element of application.contacts){
            if(element._id.toString() === contactId.toString()){
                continue;
            }
            contacts.push(element);
        }
        if(contacts.length === application.contacts.length) throw new Error('Could not find contact');
        
        let updateInfo = await cyclesCollection.update(
            {
            _id: new ObjectId(cycleId),
            "applications._id": new ObjectId(applicationId)
            }, 
            {$set: {
                "applications.$.contacts": contacts
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not remove contact');

        return true;
    }
}
