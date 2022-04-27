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
import Upcoming from 'pages/Upcoming';

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
            <Route path={'/upcoming'} element={<Upcoming />} />
            </Routes>
        </Router>
        {/* </AuthProvider> */}
        </ThemeProvider>
    );
}

export default App;
