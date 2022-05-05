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
import Metrics from 'pages/Metrics';

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
    document.body.style.backgroundColor = "#F9F8FF";
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
            <Route path={'/application/:id'} element={<Job />} />
            <Route path={'/settings'} element={<Settings />} />
            <Route path={'/metrics/:cycleId'} element={<Metrics />} />
            <Route path={'/metrics/'} element={<Metrics />} />
            </Routes>
        </Router>
        {/* </AuthProvider> */}
        </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
