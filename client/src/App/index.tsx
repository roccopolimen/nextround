import './style.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'constants';
// import { AuthProvider } from 'context';
import Landing from 'pages/Landing';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import Job from 'pages/Job';
import OfferDash from 'pages/OfferDash';
import FirstCycle from 'pages/FirstCycle';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
        {/* <AuthProvider> */}
        <CssBaseline />
        <Router>
            <Routes>
            <Route path={'*'} element={<Landing />} />
            <Route path={'/signin'} element={<SignIn />} />
            <Route path={'/signup'} element={<SignUp />} />
            <Route path={'/test_job'} element={<Job />} />
            <Route path={'/offer_dashboard'} element={<OfferDash />} />
            <Route path={'/first_cycle'} element={<FirstCycle />} />
            </Routes>
        </Router>
        {/* </AuthProvider> */}
        </ThemeProvider>
    );
}

export default App;
