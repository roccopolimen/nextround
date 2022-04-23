import './style.css';
import {Grid, Slide, Typography, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import AppToolbar from '@material-ui/core/Toolbar';
import GithubIcon from '@material-ui/icons/GitHub';
import { faGoogle, faAmazon, faSpotify, faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Landing() {
  return (
    <>
    {/* navbar */}
    <Slide direction='down' in={true} timeout={800}>
      <AppBar position='sticky' className='AppBar' color='inherit'>
        <AppToolbar>
          <div className='HeaderContainer'>
            <div className='HeaderLeftContainer'>
              <a href="http://localhost:3000/">
              <img src={require('../../images/logo.svg').default} alt="logo" width="32" height="32"/>
              </a>
            </div>
            <div>
              <Button color="inherit" id="login" onClick={() => (window.location.href = "http://localhost:3000/signin")}>Login</Button>
              <Button
                id='github-button'
                color='inherit'
                onClick={() => (window.location.href = 'https://github.com/roccopolimen/nextround')}
              >
                <GithubIcon></GithubIcon>
              </Button>
            </div>
          </div>
        </AppToolbar>
      </AppBar>
    </Slide>
    {/* content */}
      <Grid container direction='column' justifyContent='center' alignItems='center' spacing={2}>
        {/* top grid */}
        <Grid container item sm={12} lg={9} justifyContent='center' alignItems='center' spacing={3}>
          {/* body 1 left */}
          <Grid item sm={12} lg={6}>
            <Slide direction='down' in={true} timeout={1000}>
              <div className='HomePageContainer'>
                <br/>
                <br/>
                <br/>
                <Typography variant='h3' id="title">NextRound</Typography>
                <br/>
                <Typography variant='subtitle1' id="blurb">
                  Track your job applications all in one place with NextRound’s unique features that will help you land the job of your dreams! 
                  Ditch those spreadsheets; keep all the important information and upcoming events for each job application on site with a user 
                  experience tailored for the job seeker.
                </Typography>
                <br/>
                <div className="cta-button"> 
                    {/* todo why buttons not purple */}
                    <Button variant="contained" color="primary" id="signup" onClick={() => (window.location.href = "http://localhost:3000/signup")}>Sign up</Button>
                    <Button variant="outlined" color="primary" id="signin" onClick={() => (window.location.href = "http://localhost:3000/signin")}>Log in</Button>
                </div>
              </div>
            </Slide>
          </Grid>
          {/* right */}
          <Grid item sm={12} lg={6}>
            {/* TODO featured image here */}
          </Grid>
        </Grid>

        {/* bottom grid */}
        <Grid container item sm={12} lg={9} justifyContent='center' alignItems='center' spacing={3}>
          {/* body 2 left */}
          <Grid item sm={12} lg={6}>
            <Slide in={true} direction='up' timeout={2000}>
              <div className='HomePageContainer'>
                <Typography variant='h5' id="subtitle">Track Applications for Top Companies</Typography>
                <div className="logos">
                    <FontAwesomeIcon className="google-logo" icon={faGoogle} size="3x"/>
                    <FontAwesomeIcon className="spotify-logo" icon={faSpotify} size="3x"/>
                    <FontAwesomeIcon className="microsoft-logo" icon={faMicrosoft} size="3x"/>
                    <FontAwesomeIcon className="amazon-logo" icon={faAmazon} size="3x"/>
                </div>
              </div>
            </Slide>
          </Grid>
          {/* empty right */}
          <Grid item sm={12} lg={6}>
          </Grid>
        </Grid>
      </Grid>
      
    </>
  );
};