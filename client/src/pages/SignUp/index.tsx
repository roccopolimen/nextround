import './style.css';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSignUpWithEmail, useSignUpWithGoogle } from 'api';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, IconButton } from '@mui/material';
import NavBar from 'components/NavBar';
import Loading from 'components/Loading';
import { useAuthContext } from 'context';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [failedAuth, setFailedAuth] = useState(false);
    const checkAuth = useRef<boolean>(false);
    const { isLoading: isLoadingEmail, refetch: refetchEmail } = useSignUpWithEmail(email, password, displayName);
    const { isLoading: isLoadingGoogle, refetch: refetchGoogle } = useSignUpWithGoogle();
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
                    <IconButton onClick={handleGoogle}>
                        <FontAwesomeIcon className="google-logo" icon={faGoogle} size="2x"/>
                    </IconButton>
                </div>
            </Container>
            </div>
        </>
    );
};

export default SignUp;