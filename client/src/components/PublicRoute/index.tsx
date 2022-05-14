import {Navigate, Outlet} from 'react-router-dom';
import { AuthContent, useAuthContext } from 'context';

const PublicRoute = (): JSX.Element => {
    const user: AuthContent = useAuthContext();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return !user ? <Outlet /> : <Navigate to='/dashboard' />;
};

export default PublicRoute;