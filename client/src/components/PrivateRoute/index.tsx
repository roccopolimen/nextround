import {Navigate, Outlet} from 'react-router-dom';
import { useAuthContext } from 'context';

const PrivateRoute = () => {
    const user = useAuthContext();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return user ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;