import express from 'express';
import session from 'express-session';
import { Express } from 'express-serve-static-core';
import cors from 'cors';
import configRoutes from './routes';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import dotenv from 'dotenv';
import path from 'path';
import { getSession } from './helpers';

// establish link to environment variables
dotenv.config({ path: path.resolve() + '/.env' });

// establish link to firebase
initializeApp({ credential: applicationDefault() });

const app: Express = express();
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
app.set('trust proxy', 1);
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
    if(req.originalUrl.startsWith('/users') || req.session.user) next();
    else {
        const token: string = req.headers.authorization as string;
        getSession(token)
        .then(sessionObject => {
            req.session.user = sessionObject;
            next();
        })
        .catch(e => {
            console.log(e.message);
            next();
        });
    }
});
app.use('*', (req, _, next) => {
    const date: string = new Date().toUTCString();
    const reqmethod: string = req.method;
    const reqroute: string = req.originalUrl;
    const loggedin: boolean = req.session.user !== null;
    console.log('Session user: ', req.session.user);
    console.log(`[${date}]: ${reqmethod} ${reqroute} | Authorized: ${loggedin}`);
    next();
});
configRoutes(app);

app.listen(process.env.PORT || 4000, () => {
    console.log('** server running on http://localhost:4000 **');
});
