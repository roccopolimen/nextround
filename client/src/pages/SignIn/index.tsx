import './style.css';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSignInWithEmail, useSignInWithGoogle } from 'api';
import { Alert, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from 'components/NavBar';
import Loading from 'components/Loading';
import { useAuthContext } from 'context';

import SideDrawer from 'components/SideDrawer';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failedAuth, setFailedAuth] = useState(false);
    const checkAuth = useRef<boolean>(false);
    const { isLoading: isLoadingEmail, refetch: refetchEmail } = useSignInWithEmail(email, password);
    const { isLoading: isLoadingGoogle, refetch: refetchGoogle } = useSignInWithGoogle();
    const navigate = useNavigate();
    const user = useAuthContext();

    useEffect(() => {
        if(!checkAuth.current && user) navigate('/dashboard');
        checkAuth.current = true;
    }, [navigate, user]);

    const handleGoogle = () => {
        setFailedAuth(false);
        (async () => {
            try {
                await refetchGoogle({ throwOnError: true });
                navigate('/dashboard');
            } catch(e) {
                setFailedAuth(true);
            }
        })();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFailedAuth(false);
        (async () => {
            try {
                await refetchEmail({ throwOnError: true });
                navigate('/dashboard');
            } catch(e) {
                setPassword('');
                setFailedAuth(true);
            }
        })();
    };

    return (
        <>
            <NavBar />
            <SideDrawer />
            <div>
                {failedAuth && <Alert severity="error">email or password incorrect</Alert>}
                <Loading open={isLoadingEmail || isLoadingGoogle} />
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
                            <PermIdentityOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign In
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Box display="flex" justifyContent="center">
                                <Link to="/signup">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                    <div className="logos">
                        <IconButton onClick={handleGoogle}>
                            <FontAwesomeIcon className="google-logo" icon={faGoogle} size="2x"/>
                        </IconButton>
                    </div>
                </Container>
            </div>
        </>
    );
}