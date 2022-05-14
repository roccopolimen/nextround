import applicationRoutes from './applications';
import usersRoutes from './users';
import cyclesRoutes from './cycles';
import metricsRoutes from './metrics';
import offersRoutes from './offers';
import forumRoutes from './forum';
import { Express } from 'express-serve-static-core';

const constructorMethod = (app: Express) => {
    
    app.use('/application', applicationRoutes);
    app.use('/users', usersRoutes);
    app.use('/cycles', cyclesRoutes);
    app.use('/metrics', metricsRoutes);
    app.use('/offers', offersRoutes);
    app.use('/forum', forumRoutes);

    // catch all bad URLs and provide a 404.
    app.use('*', (_, res) => {
        res.status(404).json({ message: 'Page Not Found' });
    });
};

export default constructorMethod;
