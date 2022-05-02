import UpcomingBox from "components/UpcomingBox";

import AppToolbar from '@material-ui/core/Toolbar';
import GithubIcon from '@material-ui/icons/GitHub';
import { Grid, Box, Card, CardMedia, CardContent, Typography, Slide, AppBar, Button } from '@mui/material';
import JobCardList from "components/JobCardList";
import './style.css';

const Upcoming = () => {
    return (
        <>          
            <Grid container className='grid' spacing={5} justifyContent="space-around" alignItems="stretch">
                <Slide direction='right' in={true} timeout={800}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} justifyContent="center" alignItems="center" >
                        <br/>
                        <Typography className="title" variant='h3'>Upcoming</Typography>
                        <br/>
                        <UpcomingBox url={'google.com'} company={'Google'} role={'Software Engineer'} date={'1/21/22'} title={'Final Round On-Site'} />
                        <UpcomingBox url={'google.com'} company={'Google'} role={'Software Engineer'} date={'1/21/22'} title={'Final Round On-Site'} />
                    </Grid>
                </Slide>
                <Slide direction='left' in={true} timeout={800}>
                    <Grid item xs={12} sm={8} md={6} lg={4} xl={4} justifyContent="center" alignItems="center">
                        <JobCardList title={'To Apply'} />
                        <JobCardList title={'Applied'} />
                    </Grid>
                </Slide>
            </Grid>
        </>
    );
};

export default Upcoming;