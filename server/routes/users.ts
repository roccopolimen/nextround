import express from 'express';
import { getAuth } from "firebase-admin/auth";

const router = express.Router();


// GET /signOut
router.get('/signOut', async (req, res) => {
    try {
        req.session.destroy(() => {});
        return res.json({ message: 'Hello World!' });
    } catch(e) {
        return res.status(500).json({ message: 'Internal Server Error. Failed to destroy cookie.' });
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
        console.log(idToken);
        const { email, uid } = await getAuth().verifyIdToken(idToken);
        console.log('after');
        // TODO: interact with users collection in database here.
        const user = { _id: uid, email: email };
        console.log(user);
        req.session.user = user;
        console.log(req.session.user);
        return res.json({ message: 'Logged in.' });
    } catch(e) {
        console.log(e.message);
        return res.status(403).json({ message: 'Unauthorized. Failed to verify token.' });
    }
});




// module.exports = router;
export default router;