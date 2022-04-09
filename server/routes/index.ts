import usersRoutes from './users';

const constructorMethod = (app: any) => {
    
    app.use('/users', usersRoutes);

    // catch all bad URLs and provide a 404.
    app.use('*', (_, res) => {
        res.status(404).json({ message: 'Page Not Found' });
    });
};

export default constructorMethod;