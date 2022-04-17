import express from 'express';
import { checkDate, checkNonEmptyString, checkObjectId, checkPositiveNumber, isUsersApplication } from '../helpers';
import { ApplicationObject, ContactObject, EventObject } from '../typings';

const router = express.Router();

// GET /:applicationId
router.get('/:applicationId', async (req, res) => {
    const { applicationId } = req.params;
    if(!applicationId || checkObjectId(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    try {
        // TODO: use the data function to get the application
        const application: ApplicationObject = null;
        res.json(application);
    } catch(e) {
        res.status(500).json({ message: 'Could not get information about the requested application from the database.', error: e.message });
    }
});

// GET /:cycleId/:applicationId
router.get('/:cycleId/:applicationId', async (req, res) => {
    const { applicationId, cycleId } = req.params;
    if(!applicationId || !checkObjectId(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });
    if(!cycleId || !checkObjectId(cycleId))
        return res.status(400).json({ message: 'cycle id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    try {
        // TODO: use the data functions to get the application
        const application: ApplicationObject = null;
        res.json(application);
    } catch(e) {
        res.status(500).json({ message: 'Could not get information about the requested application from the database.', error: e.message });
    }

});

// POST /
router.post('/', async (req, res) => {
    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!req.body)
        return res.status(400).json({ message: 'no body provided for application creation.' });

    let company: string, position: string, location: string, jobPostUrl: string, description: string;
    try {
        ({ company, position, location, jobPostUrl, description } = req.body);
        if(!company || !checkNonEmptyString(company))
            throw new Error('Company name must be provided.');
        if(!position || !checkNonEmptyString(position))
            throw new Error('Job Position must be provided.');
        if(!location || !checkNonEmptyString(location))
            throw new Error('Job Location must be provided.');
        if(!jobPostUrl || !checkNonEmptyString(jobPostUrl))
            throw new Error('Job Post Url must be provided.');
        if(!description || checkNonEmptyString(description))
            throw new Error('Description must be provided.');
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }

    try {
        // TODO: use data function for create application
        const application: ApplicationObject = null;
        res.json(application);
    } catch(e) {
        res.status(500).json({ message: 'problem creating the application.', error: e.message });
    }
});

// POST /event/:applicationId
router.post('/event/:applicationId', async (req, res) => {
    const { applicationId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    if(!req.body)
        return res.status(400).json({ message: 'no body provided for event creation.' });

    let title: string, date: string, location: string;
    try {
        ({ title, date, location } = req.body);
        if(!title || !checkNonEmptyString(title))
            throw new Error('Event Title must be provided.');
        if(!date || !checkDate(date))
            throw new Error('Event Date must be provided.');
        if(!location || !checkNonEmptyString(location))
            throw new Error('Event Location must be provided.');
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }

    try {
        // TODO: use data function for adding event to application
        const event: EventObject = null;
        res.json(event);
    } catch(e) {
        res.status(500).json({ message: 'problem creating event for the given application.', error: e.message });
    }

});

// POST /contact/:applicationId
router.post('/contact/:applicationId', async (req, res) => {
    const { applicationId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    if(!req.body)
        return res.status(400).json({ message: 'no body provided for contact creation.' });

    let name: string, pronouns: string, location: string, phone: string, email: string;
    try {
        ({ name, pronouns, location, phone, email } = req.body);
        if(!name || !checkNonEmptyString(name))
            throw new Error('Contact Name must be provided.');
        if(!pronouns || !checkNonEmptyString(pronouns))
            throw new Error('Contact Pronouns must be provided.');
        if(!location || !checkNonEmptyString(location))
            throw new Error('Contact Location must be provided.');
        if(!phone || !checkNonEmptyString(phone))
            throw new Error('Contact Phone must be provided.');
        if(!email || !checkNonEmptyString(email))
            throw new Error('Contact Email must be provided.');
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }

    try {
        // TODO: use data functions for adding contact to application
        const contact: ContactObject = null;
        res.json(contact);
    } catch(e) {
        res.status(500).json({ message: 'problem creating contact for application.', error: e.message })
    }

});

// PATCH /:applicationId
router.patch('/:applicationId', async (req, res) => {
    const { applicationId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    if(!req.body)
        return res.status(400).json({ message: 'no body provided for contact creation.' });

    let company: string, position: string, location: string, jobPostUrl: string, description: string, salary: number, cardColor: string, progress: number;
    let newDataObject: [id: string], any = {};
    try {
        if(company) {
            if(!checkNonEmptyString(company))
                throw new Error('Company must be a non-empty string.');
            else
                newDataObject['company'] = company;
        }
        if(position) {
            if(!checkNonEmptyString(position))
                throw new Error('Position must be a non-empty string.');
            else
                newDataObject['position'] = position;
        }
        if(location) {
            if(!checkNonEmptyString(location))
                throw new Error('Location must be a non-empty string.');
            else
                newDataObject['location'] = location;
        }
        if(jobPostUrl) {
            if(!checkNonEmptyString(jobPostUrl))
                throw new Error('Job Post URL must be a non-empty string.');
            else
                newDataObject['jobPostUrl'] = jobPostUrl;
        }
        if(description) {
            if(!checkNonEmptyString(description))
                throw new Error('Description must be a non-empty string.');
            else
                newDataObject['description'] = description;
        }
        if(salary) {
            if(!checkPositiveNumber(salary))
                throw new Error('Salary must be a positive number.');
            else
                newDataObject['salary'] = salary;
        }
        if(cardColor) {
            if(!checkNonEmptyString(cardColor))
                throw new Error('Card Color must be a non-empty string.');
            else
                newDataObject['cardColor'] = cardColor;
        }
        if(progress) {
            if(!checkPositiveNumber(progress))
                throw new Error('Progress must be a positive number.');
            else
                newDataObject['progress'] = progress;
        }
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }

    if(Object.keys(newDataObject).length === 0)
        return res.status(400).json({ message: 'no fields provided to be changed.' });

    try {
        // TODO: use data function to update application
        const application: ApplicationObject = null;
        res.json(application);
    } catch(e) {
        res.status(500).json({ message: 'could not update application for some reason.', error: e.message });
    }
});

// PATCH /event/:applicationId/:eventId
router.patch('/event/:applicationId/:eventId', async (req, res) => {
    const { applicationId, eventId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });
    if(!eventId || !checkNonEmptyString(eventId))
        return res.status(400).json({ message: 'event id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    if(!req.body)
        return res.status(400).json({ message: 'no body provided for contact creation.' });

    let status: boolean, title: string, date: string, location: string;
    let newDataObject: [id: string], any = {};
    try {
        ({ status, title, date, location } = req.body);
        if(status)
            newDataObject['status'] = status;
        if(title) {
            if(!checkNonEmptyString(title))
                throw new Error('Title must be a non-empty string.');
            else
                newDataObject['title'] = title;
        }
        if(date) {
            if(!checkNonEmptyString(date))
                throw new Error('Date must be a non-empty string.');
            else
                newDataObject['date'] = date;
        }
        if(location) {
            if(!checkNonEmptyString(location))
                throw new Error('Location must be a non-empty string.');
            else
                newDataObject['location'] = location;
        }
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }

    if(Object.keys(newDataObject).length === 0)
        return res.status(400).json({ message: 'no fields provided to update.' });
    
    try {
        // TODO: use data functions to update event
        const event: EventObject = null;
        res.json(event);
    } catch(e) {
        return res.status(500).json({ message: 'failed to update event.', error: e.message });
    }
});

// PATCH /contact/:applicationId/:contactId
router.patch('/contact/:applicationId/:contactId', async (req, res) => {
    const { applicationId, contactId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });
    if(!contactId || !checkNonEmptyString(contactId))
        return res.status(400).json({ message: 'contact id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    if(!req.body)
        return res.status(400).json({ message: 'no body provided for contact creation.' });

    let name: string, pronouns: string, location: string, phone: string, email: string;
    let newDataObject: [id: string], any = {};
    try {
        ({ name, pronouns, location, phone, email } = req.body);
        if(name) {
            if(!checkNonEmptyString(name))
                throw new Error('Name must be a non-empty string.');
            else
                newDataObject['name'] = name;
        }
        if(pronouns) {
            if(!checkNonEmptyString(pronouns))
                throw new Error('Pronouns must be a non-empty string.');
            else
                newDataObject['pronouns'] = pronouns;
        }
        if(location) {
            if(!checkNonEmptyString(location))
                throw new Error('Location must be a non-empty string.');
            else
                newDataObject['location'] = location;
        }
        if(phone) {
            if(!checkNonEmptyString(phone))
                throw new Error('Phone must be a non-empty string.');
            else
                newDataObject['phone'] = phone;
        }
        if(email) {
            if(!checkNonEmptyString(email))
                throw new Error('Email must be a non-empty string.');
            else
                newDataObject['email'] = email;
        }
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }

    if(Object.keys(newDataObject).length === 0)
        return res.status(400).json({ message: 'no fields provided to update.' });
    
    try {
        // TODO: use data functions to update comtact
        const contact: ContactObject = null;
        res.json(contact);
    } catch(e) {
        return res.status(500).json({ message: 'failed to update contact.', error: e.message });
    }
});

// DELETE /:applicationId
router.delete('/:applicationId', async (req, res) => {
    const { applicationId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    try {
        // TODO: use data function to delete application.
        res.json({ message: 'deleted successfully.' });
    } catch(e) {
        res.status(500).json({ message: 'problem occurred while deleting application.', error: e.message });
    }
});

// DELETE /event/:applicationId/:eventId
router.delete('/event/:applicationId/:eventId', async (req, res) => {
    const { applicationId, eventId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });
    if(!eventId || !checkNonEmptyString(eventId))
        return res.status(400).json({ message: 'event id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    try {
        // TODO: use data function to delete event from application.
        res.json({ message: 'deleted successfully.' });
    } catch(e) {
        res.status(500).json({ message: 'problem occurred while deleting event from application.', error: e.message });
    }
});

// DELETE /contact/:applicationId/:contactId
router.delete('/contact/:applicationId/:contactId', async (req, res) => {
    const { applicationId, contactId } = req.params;
    if(!applicationId || !checkNonEmptyString(applicationId))
        return res.status(400).json({ message: 'application id must be a string representing a mongoDB ObjectId.' });
    if(!contactId || !checkNonEmptyString(contactId))
        return res.status(400).json({ message: 'contact id must be a string representing a mongoDB ObjectId.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    if(!(await isUsersApplication(req.session.user._id, applicationId)))
        return res.status(401).json({ message: 'requested application is not attached to the user.' });

    try {
        // TODO: use data function to delete contact from application.
        res.json({ message: 'deleted successfully.' });
    } catch(e) {
        res.status(500).json({ message: 'problem occurred while deleting contact from application.', error: e.message });
    }
});

export default router;