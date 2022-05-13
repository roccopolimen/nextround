import { useGetCurrentCycle } from 'api';
import Loading from 'components/Loading';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const CurrentCycleRoute = () => {
    const [hasCycle, setHasCycle] = useState(false);
    const {
        data,
        isLoading,
        refetch
    } = useGetCurrentCycle();

    useEffect(() => {
        const fetch = async () => {
            try {
                await refetch({ throwOnError: true });
                setHasCycle(true);
            } catch(e) {
                console.log(e);
                setHasCycle(false);
            }
        }
        fetch();
    }, []);

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    if(isLoading) return <Loading open={true} />;
    return hasCycle ? <Outlet /> : <Navigate to='/create' />;
};

export default CurrentCycleRoute;