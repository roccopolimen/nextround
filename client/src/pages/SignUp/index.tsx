import './style.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Box, Button, Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContent, useAuthContext } from 'context';
import { useSignUpWithEmail, useSignUpWithGoogle } from 'api';
import NavBar from 'components/NavBar';
import Loading from 'components/Loading';

const SignUp = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [failedAuth, setFailedAuth] = useState<boolean>(false);
    const checkAuth = useRef<boolean>(false);
    const { isLoading: isLoadingEmail, refetch: refetchEmail } = useSignUpWithEmail(email, password, displayName);
    const { isLoading: isLoadingGoogle, refetch: refetchGoogle } = useSignUpWithGoogle();
    const navigate = useNavigate();
    const user: AuthContent = useAuthContext();

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
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            <TextField
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                autoFocus
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Typography variant="caption" display="block" gutterBottom>
                                *Password must be six (6) characters long
                            </Typography>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Box display="flex" justifyContent="center">
                            <Link to="/signin">
                                Already have an account? Sign in
                            </Link>
                        </Box>
                    </Box>
                </Box>
                <div className="logos">
                    <IconButton aria-label="Sign Up with Google" onClick={handleGoogle}>
                        <FontAwesomeIcon className="google-logo" icon={faGoogle} size="2x"/>
                    </IconButton>
                </div>
            </Container>
            </div>
        </>
    );
};

export default SignUp;