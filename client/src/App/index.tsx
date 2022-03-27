import './style.css';
import 'styles/styleguide.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from 'constants';
// import { AuthProvider } from 'context';
import Landing from 'pages/Landing';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
        {/* <AuthProvider> */}
        <CssBaseline />
        <Router>
            <Routes>
            <Route path={'*'} element={<Landing />} />
            </Routes>
        </Router>
        {/* </AuthProvider> */}
        </ThemeProvider>
    );
}

export default App;
