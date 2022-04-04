import express from 'express';
import session from 'express-session';
import cors from 'cors';
import configRoutes from './routes';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve() + '/.env' });
initializeApp({
    credential: applicationDefault(),
    databaseURL: "mongodb://localhost:27017/"
});

const app = express();

// const checkAuth = async (req, res, next) => {
//     try {
//         if(!req.headers.authtoken) throw new Error('no auth token in header');
//         await firebaseAuth.verifyIdToken(req.headers.authtoken);
//         next();
//     } catch(e) {
//         res.status(403).json({ message: 'Unauthorized', error: e.message });
//     }
// };

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});
app.use(session({
    name: 'AuthCookie',
    secret: "Michael Karsen is an iPad kid",
    saveUninitialized: true,
    resave: false
}));
app.use('*', (req, _, next) => {
    let date = new Date().toUTCString();
    let reqmethod = req.method;
    let reqroute = req.originalUrl;
    let loggedin = false;
    console.log('Session user: ', req.session.user);
    if(req.session.user) loggedin = true;
    console.log(`[${date}]: ${reqmethod} ${reqroute} | Authorized: ${loggedin}`);
    next();
});

configRoutes(app);

app.listen(4000, () => {
    console.log('** server running on http://localhost:4000 **');
});