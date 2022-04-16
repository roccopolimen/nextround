import usersRoutes from './users';
import cyclesRoutes from './cycles';
import metricsRoutes from './metrics';

const constructorMethod = (app: any) => {
    
    app.use('/users', usersRoutes);
    app.use('/cycles', cyclesRoutes);
    app.use('/metrics', metricsRoutes);

    // catch all bad URLs and provide a 404.
    app.use('*', (_, res) => {
        res.status(404).json({ message: 'Page Not Found' });
    });
};

export default constructorMethod;