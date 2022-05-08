import express from 'express';
import session from 'express-session';
import cors from 'cors';
import configRoutes from './routes';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve() + '/.env' });
initializeApp({
    credential: applicationDefault()
});

const app = express();
app.use(cors({ credentials: true, origin: process.env.ORIGIN_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
});
app.set('trust proxy', 1)
app.use(session({
    name: 'AuthCookie',
    secret: "Michael Karsen is an iPad kid",
    saveUninitialized: true,
    resave: false,
    proxy: true,
    cookie: process.env.production ? {
    	secure: true,
        httpOnly: false,
        sameSite: 'none'
    } : null
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

app.listen(process.env.PORT || 4000, () => {
    console.log('** server running on http://localhost:4000 **');
});
