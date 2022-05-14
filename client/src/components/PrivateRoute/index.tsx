import {Navigate, Outlet} from 'react-router-dom';
import { AuthContent, useAuthContext } from 'context';

const PrivateRoute = (): JSX.Element => {
    const user: AuthContent = useAuthContext();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;