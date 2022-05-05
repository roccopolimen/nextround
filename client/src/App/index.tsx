import './style.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'constants';
// import { AuthProvider } from 'context';
import Landing from 'pages/Landing';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import Job from 'pages/Job';
import Settings from 'pages/Settings';
import OfferDash from 'pages/OfferDash';
import AddCycle from 'pages/AddCycle';

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
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

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
        {/* <AuthProvider> */}
        <CssBaseline />
        <Router>
            <Routes>
            <Route path={'*'} element={<Landing />} />
            <Route path={'/signin'} element={<SignIn />} />
            <Route path={'/signup'} element={<SignUp />} />
<<<<<<< HEAD
            <Route path={'/test_job'} element={<Job />} />
            <Route path={'/offers'} element={<OfferDash />} />
            <Route path={'/create'} element={<AddCycle />} />
=======
            <Route path={'/application/:id'} element={<Job />} />
>>>>>>> dc26b11b6a26400660df9c9c97ba2bdef1c090dc
            <Route path={'/settings'} element={<Settings />} />
            </Routes>
        </Router>
        {/* </AuthProvider> */}
        </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
