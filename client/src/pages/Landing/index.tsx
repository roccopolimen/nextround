import "./style.css";
import {
    Box,
    Button,
    Grid,
    Slide,
    Typography,
    useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
    faGoogle,
    faAmazon,
    faSpotify,
    faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "components/NavBar";

export default function Landing() {
    let navigate = useNavigate();
    // Responsive design
    const mobile: boolean = useMediaQuery("(max-width: 600px)");
    const tablet: boolean = useMediaQuery("(max-width: 1200px)");
    const desktop: boolean = useMediaQuery("(min-width: 1201px");
    const width: string = mobile ? "100%" : tablet ? "65%" : "85%";
    const height: string = mobile ? "100%" : tablet ? "65%" : "100%";
    const ml: number = desktop ? 20 : 0;

    return (
        <>
            {/* navbar */}
            <NavBar />
            {/* content */}
            <Box ml={ml}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
            <Grid
                container
                direction="column"
                alignItems="center"
                className="justify-center"
                spacing={2}
            >
                {/* top grid */}
                <Grid
                    container
                    item
                    sm={12}
                    lg={9}
                    alignItems="center"
                    className="justify-center"
                    spacing={3}
                >
                    {/* body 1 left */}
                    <Grid item sm={12} lg={6} className="justify-center">
                        <Slide direction="down" in={true} timeout={1000}>
                        <div className="HomePageContainer">
                            <br /><br /><br />
                            <Typography variant="h1" id="title" >NextRound</Typography>
                            <br />
                            <Typography variant="h2" id="blurb">
                            Track your job applications all in one place with
                            NextRound's unique features that will help you land the job
                            of your dreams! Ditch those spreadsheets; keep all the
                            important information and upcoming events for each job
                            application on site with a user experience tailored for the
                            job seeker.
                            </Typography>
                            <br />
                            <div className="cta-button">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    id="signup"
                                    onClick={() => navigate('/signup')}
                                >Sign up
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    id="signin"
                                    onClick={() => navigate('/signin')}
                                >Log in
                                </Button>
                            </div>
                        </div>
                        </Slide>
                    </Grid>
                    {/* featured image right */}
                    <Grid item sm={12} lg={6}>
                        <Slide direction="left" in={true} timeout={2000}>
                        <img 
                            src={require('../../images/landing_graphic.png')}
                            alt="graphic" width={width} height={height} />
                        </Slide>
                    </Grid>
                </Grid>

                {/* bottom grid */}
                <Grid
                    container
                    item
                    sm={12}
                    lg={9}
                    alignItems="center"
                    className="justify-center"
                    spacing={3}
                >
                    {/* body 2 left */}
                    <Grid item sm={12} lg={6}>
                        <Slide in={true} direction="up" timeout={2000}>
                        <div className="HomePageContainer">
                            <Typography variant="h3" id="subtitle">
                            Track Applications for Top Companies
                            </Typography>
                            <div className="logos">
                                <FontAwesomeIcon
                                    className="google-logo"
                                    icon={faGoogle}
                                    size="3x"
                                />
                                <FontAwesomeIcon
                                    className="spotify-logo"
                                    icon={faSpotify}
                                    size="3x"
                                />
                                <FontAwesomeIcon
                                    className="microsoft-logo"
                                    icon={faMicrosoft}
                                    size="3x"
                                />
                                <FontAwesomeIcon
                                    className="amazon-logo"
                                    icon={faAmazon}
                                    size="3x"
                                />               
                            </div>
                        </div>
                        </Slide>
                    </Grid>
                    {/* empty right */}
                    <Grid item sm={12} lg={6}></Grid>
                </Grid>
            </Grid>
            </Box>
        </>
    );
}
