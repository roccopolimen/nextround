import express from 'express';
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { ObjectId } from 'mongodb';
import { createUser, getUserByEmail, removeUser } from '../data';
import { checkNonEmptyString } from '../helpers';

const router = express.Router();

// GET /signOut
router.get('/signOut', async (req, res) => {
    try {
        req.session.destroy(() => {});
        return res.json({ message: 'Logged out.' });
    } catch(e) {
        return res.status(500).json({ message: 'Internal Server Error. Failed to destroy cookie.', error: e.message });
    }
});

// POST /signIn
router.post('/signIn', async (req, res) => {
    if(req.session.user) // already logged in
        return res.status(403).json({ message: 'Unauthorized. User already logged in.' });

    if(!req.headers.authorization)// no auth token provided
        return res.status(403).json({ message: 'Unauthorized. Need token for login.' });

    let email: string;
    try { // authenticate with firebase
        let idToken: string = req.headers.authorization as string;
        if(!idToken || !checkNonEmptyString(idToken))
            throw new Error("[routes/users POST signIn] id token is invalid.");
        idToken = idToken.split('JWT ')[1];  
        ({ email } = await getAuth().verifyIdToken(idToken));
    } catch(e) {
        return res.status(403).json({ message: 'Unauthorized. Failed to verify token.', error: e.message });
    }

    let id: ObjectId;
    try { // ensure user is in the database
        ({ _id: id } = await getUserByEmail(email));
    } catch(e) {
        return res.status(401).json({ message: 'User does not exist in database, try sign up.', error: e.message });
    }

    // establish express session for current user
    const user = { _id: id.toString(), email: email };
    req.session.user = user;
    return res.json({ message: 'Signed in.' });
});

// POST /signUp
router.post('/signUp', async (req, res) => {
    if(req.session.user) // already logged in
        return res.status(403).json({ message: 'Unauthorized. User already logged in.' });

    if(!req.headers.authorization) // no auth token provided
        return res.status(403).json({ message: 'Unauthorized. Need token for login.' });

    let uid: string, email: string, name: string;
    try { // authenticate with firebase
        let idToken: string = req.headers.authorization as string;
        idToken = idToken.split('JWT ')[1];
        if(!idToken || !checkNonEmptyString(idToken))
            throw new Error("[routes/users POST signUp] id token is invalid.");
        const decodedToken: DecodedIdToken = await getAuth().verifyIdToken(idToken);
        uid = decodedToken.uid;
        email = decodedToken.email;
        name = (await getAuth().getUser(uid)).displayName;
    } catch(e) {
        return res.status(403).json({ message: 'Unauthorized. Failed to verify token.', error: e.message });
    }

    try { // ensure user does not exist already
        await getUserByEmail(email);
        return res.status(401).json({ message: 'User already exists. Cannot sign up with this email' });
    } catch(e) {}

    let id: ObjectId;
    try { // Add the user to the DB
        ({ _id: id} = await createUser(uid, email, name));
    } catch(e) {
        return res.status(500).json({ message: 'Issue creating user in database.', error: e.message });
    }

    // establish express session for current user
    const user = { _id: id.toString(), email: email };
    req.session.user = user;
    return res.json({ message: 'Signed up.' });
});

// PATCH /settings
router.patch('/settings', async (req, res) => {
    // TODO: change pfp??
    // TODO: change user's name??
});

// DELETE /
router.delete('/', async (req, res) => {
    if(!req.session.user) // check if logged in
        throw new Error("[routes/users DELETE /] no user is logged in.");

    try {
        await removeUser(req.session.user._id);
        req.session.destroy(() => {});
        return res.json({ message: 'User deleted.' });
    } catch(e) {
        return res.status(500).json({ message: 'Removing user failed.', error: e.message });
    }
});

export default router;