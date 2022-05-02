import applicationRoutes from './applications';
import usersRoutes from './users';
import cyclesRoutes from './cycles';
import metricsRoutes from './metrics';
import offersRoutes from './offers';
import forumRoutes from './forum';
import clearbitRoutes from './clearbit';

const constructorMethod = (app: any) => {
    
    app.use('/application', applicationRoutes);
    app.use('/users', usersRoutes);
    app.use('/cycles', cyclesRoutes);
    app.use('/metrics', metricsRoutes);
    app.use('/offers', offersRoutes);
    app.use('/forum', forumRoutes);
    // app.use('/clearbit', clearbitRoutes);

    // catch all bad URLs and provide a 404.
    app.use('*', (_, res) => {
        res.status(404).json({ message: 'Page Not Found' });
    });
};

export default constructorMethod;