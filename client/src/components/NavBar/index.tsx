import "./styles.css";
import {
    AppBar,
    Button,
    IconButton,
    Slide,
    Toolbar,
} from "@mui/material";
import GithubIcon from "@material-ui/icons/GitHub";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    return (
            <Slide direction="down" in={true} timeout={800}>
            <AppBar position="sticky" className="AppBar" color="inherit">
            <Toolbar>
            <div className="HeaderContainer">
                <div className="HeaderLeftContainer">
                    <IconButton onClick={() => navigate('/')}>
                    <img
                        src={require("images/logo.svg").default}
                        alt="logo"
                        width="32"
                        height="32"
                        />
                    </IconButton>
                </div>
                <div>
                    <Button
                        color="inherit"
                        id="login"
                        onClick={() => navigate('/signin')}
                    >Login
                    </Button>
                    <IconButton
                        id="github-button"
                        color="inherit"
                        aria-label="GitHub Link"
                        onClick={() => window.open("https://github.com/roccopolimen/nextround")}
                    >
                        <GithubIcon />
                    </IconButton>
                </div>
            </div>
            </Toolbar>
            </AppBar>
            </Slide>
    );
};

export default NavBar;