import applicationRoutes from './applications';
import usersRoutes from './users';
import cycleRoutes from './cycles';

const constructorMethod = (app: any) => {
    
    app.use('/application', applicationRoutes);
    app.use('/users', usersRoutes);
    app.use('/cycles', cycleRoutes);

    // catch all bad URLs and provide a 404.
    app.use('*', (_, res) => {
        res.status(404).json({ message: 'Page Not Found' });
    });
};

export default constructorMethod;