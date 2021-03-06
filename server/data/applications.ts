import { cycles, users } from '../config/mongoCollections';
import { ObjectId } from 'mongodb';
import { checkObjectId, checkNonEmptyString, checkNonNegativeNumber, checkDate } from '../helpers';
import { CycleObject, ApplicationObject, UserObject } from '../typings';
import { randomColor } from '../helpers';
import axios from 'axios';

/**
 * @description Uses Clearbit API to get the company's logo
 * @param {string} company name of the company
 * @returns {Promise<string>} the link to company logo
 */
const searchLogo = async (company: string): Promise<string> => {
    try {
        const { data } = await axios.get(`https://company.clearbit.com/v1/domains/find?name=${company}`,
                                        { auth: { username: process.env.CLEARBIT_API_KEY, password: '' } });
        return data.logo;
    } catch(e) {
        console.log('Clearbit API call failed.');
        console.log(e.message);
        return '';
    }
};

/**
 * @description Get an application by id
 * @param {string} userId user id
 * @param {string} applicationId Application id
 * @returns {Promise<ApplicationObject>} Cycle Object with given id if found 
 * and throws an error otherwise
 */
export const getApplicationById = async (userId: string, applicationId: string): Promise<ApplicationObject> => {
    if(!userId || !checkObjectId(userId))
        throw new Error("A proper user id must be provided.");

    if(!applicationId || !checkObjectId(applicationId))
        throw new Error("A proper application id must be provided.");

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleId: ObjectId = user.cycles[user.cycles.length-1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error("User has no cycles.");

    const application: ApplicationObject = cycle.applications.find(a => a._id.toString() === applicationId);
    if(application === undefined) throw new Error("No application found with that id.");
    
    return application;
};

/**
 * @description Get an application by id from a given cycle
 * @param {string} cycleId cycle id
 * @param {string} applicationId Application id
 * @returns {Promise<ApplicationObject>} Cycle Object with given id if found 
 * and throws an error otherwise
 */
 export const getApplicationFromCycleById = async (cycleId: string, applicationId: string): 
                                                                    Promise<ApplicationObject> => {
    if(!cycleId || !checkObjectId(cycleId))
        throw new Error("A proper cycle id must be provided.");

    if(!applicationId || !checkObjectId(applicationId))
        throw new Error("A proper application id must be provided.");

    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: new ObjectId(cycleId) });
    if(cycle === null) throw new Error("User has no cycles.");

    const application: ApplicationObject = cycle.applications.find(a => a._id.toString() === applicationId);
    if(application === undefined) throw new Error("No application found with that id.");
    
    return application;
};

/**
 * @description Creates a new application within a given cycle
 * @param {string} userId The user id
 * @param {string} company Company the application is for
 * @param {string} position Position beign applied to
 * @param {string} location Location being applied to
 * @param {string} jobPostUrl URL the application was found at
 * @param {string} description Application description
 * @param {string} applyDate Date to apply by
 * @returns {Promise<ApplicationObject>} Returns the created application Object if successful anf throws
 * and error otherwise
 */
export const createApplication = async (userId: string, company: string, position: string, location: string,
                                        jobPostUrl: string, description: string, applyDate: string):
                                                                                    Promise<ApplicationObject> => {
    if(!userId || !checkObjectId(userId))
        throw new Error("A proper cycle id must be provided.");
    if(!company || !checkNonEmptyString(company))
        throw new Error("A company name must be provided.");
    if(!position || !checkNonEmptyString(position))
        throw new Error("A position name must be provided.");
    if(!location || !checkNonEmptyString(location))
        throw new Error("A location must be provided.");
    if(!jobPostUrl || !checkNonEmptyString(jobPostUrl))
        throw new Error("An application url must be provided.");
    if(!description || !checkNonEmptyString(description))
        throw new Error("A description must be provided.");
    if(!applyDate || !checkDate(applyDate))
        throw new Error('Apply by date must be provided.');
    

    const logo = await searchLogo(company);
    const cardColor: string = randomColor();
    const newApp: ApplicationObject = {
        _id: new ObjectId(),
        company: company,
        companyLogo: logo,
        position: position,
        location: location,
        salary: 0, 
        jobPostUrl: jobPostUrl,
        cardColor: cardColor,
        description: description,
        progress: 0,
        notes: [],
        events: [{
            _id: new ObjectId(),
            status: false,
            title: "Apply",
            date: new Date(applyDate),
            location: ""
        }],
        contacts: []
    };

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleId: ObjectId = user.cycles[user.cycles.length-1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error("User has no cycles.");

    cycle.applications.push(newApp);
    let updatedInfo = await cyclesCollection.updateOne({ _id: cycle._id }, { $set: cycle });
    if(updatedInfo.modifiedCount === 0)
        throw new Error("Could not update cycle with new application.");

    return await getApplicationFromCycleById(cycleId.toString(), newApp._id.toString());
};

/**
 * @description Updates a given application with new data
 * @param {string} userId user id
 * @param {string} applicationId Id of application to change
 * @param {string} company
 * @param {string} position
 * @param {string} location
 * @param {string} jobPostUrl
 * @param {string} description
 * @param {string} salary
 * @param {string} cardColor
 * @param {string} progress
 * @returns {Promise<ApplicationObject>} Returns the updated application if successful and 
 * throws an error otherwise
 */
export const updateApplication = async (userId: string, applicationId: string, company: string, position: string,
                                        location: string, jobPostUrl: string, description: string, salary: number,
                                        cardColor: string, progress: number): Promise<ApplicationObject> => {

    if(!userId || !checkObjectId(userId))
        throw new Error("A proper cycle id must be provided.");
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error("A proper application id must be provided.");

    let updateFields: Partial<ApplicationObject> = {};
    if(company) {
        if(!checkNonEmptyString(company))
            throw new Error('Company must be a non-empty string.');
        else {
            updateFields.company = company;
            updateFields.companyLogo = await searchLogo(company);
        }
    }
    if(position) {
        if(!checkNonEmptyString(position))
            throw new Error('Position must be a non-empty string.');
        else
            updateFields.position = position;
    }
    if(location) {
        if(!checkNonEmptyString(location))
            throw new Error('Location must be a non-empty string.');
        else
            updateFields.location = location;
    }
    if(jobPostUrl) {
        if(!checkNonEmptyString(jobPostUrl))
            throw new Error('Job Post URL must be a non-empty string.');
        else
            updateFields.jobPostUrl = jobPostUrl;
    }
    if(description) {
        if(!checkNonEmptyString(description))
            throw new Error('Description must be a non-empty string.');
        else
            updateFields.description = description;
    }
    if(salary) {
        if(!checkNonNegativeNumber(salary))
            throw new Error('Salary must be a positive number.');
        else
            updateFields.salary = salary;
    }
    if(cardColor) {
        if(!checkNonEmptyString(cardColor))
            throw new Error('Card Color must be a non-empty string.');
        else
            updateFields.cardColor = cardColor;
    }
    if(progress !== null) {
        if(!checkNonNegativeNumber(progress))
            throw new Error('Progress must be a positive number.');
        else
            updateFields.progress = progress;
    }

    if(Object.keys(updateFields).length === 0)
        throw new Error('No fields needed updating.');

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleId: ObjectId = user.cycles[user.cycles.length-1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error("User has no cycles.");
    
    const appIndex: number = cycle.applications.findIndex(a => a._id.toString() === applicationId);
    if(appIndex === -1) throw new Error("Unable to find an application with that id.");

    Object.entries(updateFields).forEach(([field, newValue]) => {
        cycle.applications[appIndex][field] = newValue;
    });

    const updatedInfo = await cyclesCollection.updateOne({ _id: cycleId }, { $set: cycle });
    if(updatedInfo.modifiedCount === 0) throw new Error("Could not update application.");

    return await getApplicationFromCycleById(cycleId.toString(), applicationId);
};

/**
 * @description adds a note to the user's application
 * @param {string} userId 
 * @param {string} applicationId 
 * @param {string} note text of note to be added
 * @returns {Promise<ApplicationObject>} the updated application
 */
export const createNote = async (userId: string, applicationId: string, note: string): Promise<ApplicationObject> => {
    if(!userId || !checkObjectId(userId))
        throw new Error("A proper user id must be provided.")
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error("A proper application id must be provided.");
    if(!note || !checkNonEmptyString(note))
        throw new Error("A note must be provided.");
    
    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleId: ObjectId = user.cycles[user.cycles.length-1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error("User has no cycles.");
    
    const appIndex: number = cycle.applications.findIndex(a => a._id.toString() === applicationId);
    if(appIndex === -1) throw new Error("Unable to find an application with that id.");

    // Add note to application
    cycle.applications[appIndex].notes.push(note);
    // Update mongo db
    const updatedInfo = await cyclesCollection.updateOne({ _id: cycleId }, { $set: cycle });
    if(updatedInfo.modifiedCount === 0)
        throw new Error("Could not update application.");

    return await getApplicationById(userId, applicationId);
};

/**
 * @description Deletes an application from a given cycle
 * @param {string} userId
 * @param {string} applicationId Application to be deleted
 * @returns {Promise<boolean>} Returns true if application was successfully deleted and 
 * throws an error otherwise
 */
export const deleteApplication = async (userId: string, applicationId: string): Promise<boolean> => {
    if(!userId || !checkObjectId(userId))
        throw new Error("a proper cycle id must be provided.");
    if(!applicationId || !checkObjectId(applicationId))
        throw new Error("A proper application id must be provided.");

    const usersCollection = await users();
    const user: UserObject = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if(user === null) throw new Error("There is no user with that id.");

    const cycleId: ObjectId = user.cycles[user.cycles.length-1];
    const cyclesCollection = await cycles();
    const cycle: CycleObject = await cyclesCollection.findOne({ _id: cycleId });
    if(cycle === null) throw new Error("User has no cycles.");
    
    const appIndex: number = cycle.applications.findIndex(a => a._id.toString() === applicationId);
    if(appIndex === -1) throw new Error("Unable to find an application with that id.");

    cycle.applications.splice(appIndex, 1);
    const updatedInfo = await cyclesCollection.updateOne({ _id: cycleId }, { $set: cycle });
    if(updatedInfo.modifiedCount === 0) throw new Error("Could not update application.");

    return true;
};