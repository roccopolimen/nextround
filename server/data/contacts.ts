import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId, checkNonEmptyString, checkEmail, checkName, checkPhoneNumber } from '../helpers';
import { ApplicationObject, ContactObject, CycleObject, UserObject } from '../typings';

/**
 * @description Get contact by id
 * @param {string} userId
 * @param {string} applicationId
 * @param {string} contactId
 * @returns {Promise<ContactObject>} The contact given the ids above
 */
export const getContactById = async (userId: string, applicationId: string, contactId: string): 
                                                                                Promise<ContactObject> => {
    if(!userId || !checkObjectId(userId))
        throw new Error('Invalid userId');
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error('Invalid applicationId');
    if(!contactId || !checkObjectId(contactId))
        throw new Error('Invalid contactId');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error('Could not find user');

    const cycleId: ObjectId = user.cycles[user.cycles.length - 1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error('Could not find cycle');

    const application: ApplicationObject = cycle.applications.find(app => app._id.toString() === applicationId);
    if(application === undefined) throw new Error('Could not find application');

    const contact: ContactObject = application.contacts.find(c => c._id.toString() === contactId);
    if(contact === undefined) throw new Error('Could not find contact');

    return contact;
};

/**
 * @description Get all contacts
 * @param {string} userId
 * @param {string} applicationId
 * @returns {Promise<Array<ContactObject>>} All the contacts of the application
 */
 export const getAllContacts = async (userId: string, applicationId: string): Promise<ContactObject[]> => {

    if(!userId || !checkObjectId(userId))
        throw new Error('Invalid userId');
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error('Invalid applicationId');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error('Could not find user');

    const cycleId: ObjectId = user.cycles[user.cycles.length - 1];
    const cyclesCollection: any = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error('Could not find cycle');

    const application: ApplicationObject = cycle.applications.find(app => app._id.toString() === applicationId);
    if(application === undefined) throw new Error('Could not find application');

    return application.contacts;
};

/**
 * @description Create contact
 * @param {string} userId 
 * @param {string} applicationId
 * @param {string} name
 * @param {string} phone 
 * @param {string} email 
 * @returns {Promise<ContactObject>} if the contact was created, throws otherwise 
 */
 export const createContact = async (userId: string, applicationId: string, name: string,
                                        phone: string, email: string): Promise<ContactObject> => {

    if(!userId || !checkObjectId(userId))
        throw new Error('Invalid userId');
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error('Invalid applicationId');
    if(!name || !checkName(name))
        throw new Error('Invalid name');
    if(!phone || !checkPhoneNumber(phone))
        throw new Error('Invalid phone number');
    if(!email || !checkEmail(email))
        throw new Error('Invalid email.');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error('Could not find user');

    const cycleId: ObjectId = user.cycles[user.cycles.length - 1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error('Could not find cycle');

    const newContact: ContactObject = {
        _id: new ObjectId(),
        name: name,
        phone: phone,
        email: email
    };

    const application: ApplicationObject = cycle.applications.find(app => app._id.toString() === applicationId);
    if(application === undefined) throw new Error('Could not find application');
    
    const updateInfo = await cyclesCollection.updateOne(
        { _id: cycleId, "applications._id": new ObjectId(applicationId) }, 
        { $push: { "applications.$.contacts": newContact } }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not add contact');

    return await getContactById(userId, applicationId, newContact._id.toString());
};

/**
 * @description Update contact
 * @param {string} userId 
 * @param {string} applicationId 
 * @param {string} contactId
 * @param {string} name
 * @param {string} phone
 * @param {string} email
 * @returns {Promise<ContactObject>} if the contact was updated
 */
 export const updateContact = async (userId: string, applicationId: string, contactId: string,
                                        name: string, phone: string, email: string): Promise<ContactObject> => {

    if(!userId || !checkObjectId(userId))
        throw new Error('Invalid userId');
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error('Invalid applicationId');
    if(!contactId || !checkObjectId(contactId))
        throw new Error('Invalid contactId');

    let updateFields: Partial<ContactObject> = {};
    if(name) {
        if(!checkNonEmptyString(name))
            throw new Error('Name must be a non-empty string.');
        else
            updateFields.name = name;
    }
    if(phone) {
        if(!checkPhoneNumber(phone))
            throw new Error('Phone must be a valid phone number string.');
        else
            updateFields.phone = phone;
    }
    if(email) {
        if(!checkEmail(email))
            throw new Error('Email must be a valid phone number string.');
        else
            updateFields.email = email;
    }

    if(Object.keys(updateFields).length === 0)
        throw new Error('No fields to update in contact');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error('Could not find user');

    const cyclesCollection: any = await cycles();
    const cycleId: ObjectId = user.cycles[user.cycles.length - 1];
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: new ObjectId(cycleId) });
    if(cycle === null) throw new Error('Could not find cycle');

    const appIndex: number = cycle.applications.findIndex(a => a._id.toString() === applicationId);
    if(appIndex === -1) throw new Error("Unable to find an application with that id.");

    const contactIndex: number = cycle.applications[appIndex].contacts.findIndex(c => c._id.toString() === contactId);
    if(contactIndex === -1) throw new Error("Unable to find a contact on the application with given id.");

    Object.entries(updateFields).forEach(([field, newValue]) => {
        cycle.applications[appIndex].contacts[contactIndex][field] = newValue;
    });

    // update mongodb with new contacts list
    let updateInfo = await cyclesCollection.updateOne(
        { _id: cycleId, "applications._id": new ObjectId(applicationId) }, 
        { $set: { "applications.$.contacts": cycle.applications[appIndex].contacts } }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not update contact');

    return await getContactById(userId, applicationId, contactId);
};

/**
 * @description Delete contact
 * @param {string} userId 
 * @param {string} applicationId 
 * @param {string} contactId 
 * @returns {Promise<boolean>} true if the contact was deleted, throws otherwise
 */
 export const deleteContact = async (userId: string, applicationId: string, contactId: string): Promise<boolean> => {

    if(!userId || !checkObjectId(userId))
        throw new Error('Invalid userId');
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error('Invalid applicationId');
    if(!contactId || !checkObjectId(contactId))
        throw new Error('Invalid contactId');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error('Could not find user');

    const cycleId: ObjectId = user.cycles[user.cycles.length - 1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error('Could not find cycle');

    const application: ApplicationObject = cycle.applications.find(app => app._id.toString() === applicationId);
    if(application === undefined) throw new Error('Could not find application');

    const contacts: Array<ContactObject> = application.contacts.filter(c => c._id.toString() !== contactId);
    if(contacts.length === application.contacts.length) throw new Error('Could not find contact');
    
    let updateInfo = await cyclesCollection.updateOne(
        { _id: cycleId, "applications._id": new ObjectId(applicationId) }, 
        { $set: { "applications.$.contacts": contacts } }
    );
    if (updateInfo.modifiedCount === 0) throw new Error('Could not remove contact');

    return true;
};
