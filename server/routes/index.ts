import usersRoutes from './users';
import cyclesRoutes from './cycles';
import metricsRoutes from './metrics';
import offersRoutes from './offers';

const constructorMethod = (app: any) => {
    
    app.use('/users', usersRoutes);
    app.use('/cycles', cyclesRoutes);
    app.use('/metrics', metricsRoutes);
    app.use('/offers', offersRoutes);

    // catch all bad URLs and provide a 404.
    app.use('*', (_, res) => {
        res.status(404).json({ message: 'Page Not Found' });
    });
};

export default constructorMethod;