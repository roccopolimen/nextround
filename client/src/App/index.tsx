import './style.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'constants';
import Landing from 'pages/Landing';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import Upcoming from 'pages/Upcoming';
import Job from 'pages/Job';
import Forum from 'pages/Forum';
import OfferDash from 'pages/OfferDash';
import AddCycle from 'pages/AddCycle';
import Metrics from 'pages/Metrics';
import PrivateRoute from 'components/PrivateRoute';
import PublicRoute from 'components/PublicRoute';
import { AuthProvider } from 'context';

const twentyFourHoursInMs: number = 1000 * 60 * 60 * 24;
const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            enabled: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: twentyFourHoursInMs,
        },
    },
});

const App = (): JSX.Element => {
    return (
        <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
        <AuthProvider>
        <CssBaseline />
        <Router basename={process.env.REACT_APP_PATH || ""}>
            <Routes>
                <Route path="" element={<PublicRoute />}>
                    <Route path="" element={<Landing />} />
                </Route>
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                    <Route path="dashboard" element={<Upcoming />} />
                    <Route path="application/:id" element={<Job />} />
                    <Route path="metrics/:cycleId" element={<Metrics />} />
                    <Route path="metrics" element={<Metrics />} />
                    <Route path="forum" element={<Forum />} />
                    <Route path="offers" element={<OfferDash />} />
                    <Route path="create" element={<AddCycle />} />
                </Route>
            </Routes>
        </Router>
        </AuthProvider>
        </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;
