import express from 'express';
import { getAuth } from "firebase-admin/auth";

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
    if(req.session.user)
        return res.status(403).json({ message: 'Unauthorized. User already logged in.' });

    if(!req.headers.authorization)
        return res.status(403).json({ message: 'Unauthorized. Need token for login.' });

    try {
        let idToken: string = req.headers.authorization as string;
        idToken = idToken.split('JWT ')[1];
        const { email, uid } = await getAuth().verifyIdToken(idToken);
        // TODO: also check if email and uid match database values??? Might be unnecesary
        const user = { _id: uid, email: email };
        req.session.user = user;
        return res.json({ message: 'Logged in.' });
    } catch(e) {
        return res.status(403).json({ message: 'Unauthorized. Failed to verify token.', error: e.message });
    }
});

// POST /signUp
router.post('/signUp', async (req, res) => {
    if(req.session.user)
        return res.status(403).json({ message: 'Unauthorized. User already logged in.' });

    if(!req.headers.authorization)
        return res.status(403).json({ message: 'Unauthorized. Need token for login.' });

    try {
        let idToken: string = req.headers.authorization as string;
        idToken = idToken.split('JWT ')[1];
        const { email, uid } = await getAuth().verifyIdToken(idToken);
        const { displayName } = await getAuth().getUser(uid);
        // TODO: check (uid) to make sure it hasn't been used already in the DB.
        // TODO: pass (uid, email, displayName) to a createUser function in data/users.ts to populate DB.
        const user = { _id: uid, email: email };
        req.session.user = user;
        return res.json({ message: 'Signed up.' });
    } catch(e) {
        return res.status(403).json({ message: 'Unauthorized. Failed to verify token.', error: e.message });
    }
});

export default router;