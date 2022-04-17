import collections from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId, checkNonEmptyString, checkEmail, checkName } from '../helpers';
import { ApplicationObject, ContactObject, CycleObject, EventObject, MediaObject, UserObject } from '../typings';

export default {
    /**
     * Get contact by id
     * @param {string} cycleId
     * @param {string} applicationId
     * @param {string} contactId
     * @returns {Promise<Object>} The contact given the ids above
     */
    getContactById: async (cycleId: string, applicationId: string, contactId: string):Promise<Object> => {

        if(checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(checkObjectId(contactId)){
            throw new Error('Invalid contactId');
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

        let contact = null;
        for(let element of application.contacts){
            if(element._id.toString() === contactId){
                contact = element
            }
        }
        if(contact === null) throw new Error('Could not find contact');

        return contact;
    },

    /**
     * Get all contacts
     * @param {string} cycleId
     * @param {string} applicationId
     * @returns {Promise<Object[]>}All the contacts of the application
     */
    getAllContacts: async (cycleId: string, applicationId: string): Promise<Object[]> => {

        if(checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(checkObjectId(applicationId)){
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
        
        let contacts = application.contacts ? application.contacts : [];

        return contacts
    },

    /**
     * Create contact
     * @param {string} cycleId 
     * @param {string} applicationId
     * @param {string} title 
     * @param {Date} date 
     * @param {String} location 
     * @returns {Promise<object>} if the contact was created, throws otherwise 
     */
    createContact: async (cycleId: string, applicationId: string, name: string, pronouns: string, location: string, phone: string, email: string): Promise<object> => {

        if(checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(checkName(name)){
            throw new Error('Invalid name');
        }
        if(checkNonEmptyString(pronouns)){
            throw new Error('Invalid pronouns');
        }
        if(checkNonEmptyString(location)){
            throw new Error('Invalid location');
        }
        if(checkNonEmptyString(phone)){
            throw new Error('Invalid phone number');
        }
        if(checkEmail(email)){
            throw new Error('Invalid Email');
        }

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
                "applications.$.contacts": newContact
                }
            }
        );
        if (updateInfo.WriteResult.nModified === 0) throw new Error('Could not add contact');

        return exports.default.readById(cycleId, applicationId, newContact._id);
       
    },

    /**
     * Update contact
     * @param {string} cycleId 
     * @param {string} applicationId 
     * @param {string} contactId
     * @param {object} contactObject can contain: {name: string, pronouns: string, location, phone: string, email: string}
     */
    updateContact: async (cycleId: string, applicationId: string, contactId: string, contactObject: object): Promise<object> => {

        if(checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(checkObjectId(contactId)){
            throw new Error('Invalid contactId');
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

        //find the contact
        let updateContact = null;
        for(let element of application.contacts){
            if(element._id.toString() === contactId){
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
            if(element._id.toString() === contactId){
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
     * @param {string} cycleId 
     * @param {string} applicationId 
     * @param {string} contactId 
     * @returns true if the contact was deleted, throws otherwise
     */
    deleteContact: async (cycleId: string, applicationId: string, contactId: string): Promise<boolean> => {

        if(checkObjectId(cycleId)){
            throw new Error('Invalid cycleId');
        }
        if(checkObjectId(applicationId)){
            throw new Error('Invalid applicationId');
        }
        if(checkObjectId(contactId)){
            throw new Error('Invalid contactId');
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

        let contacts = [];
        for(let element of application.contacts){
            if(element._id.toString() === contactId){
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
