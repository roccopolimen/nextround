import './style.css'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

const UpcomingBox = (props: {applicationId: string, url: string, title: string, company: string, role: string, date: string}) => {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // State variables
    const [applicationId, setApplicationId] = useState('');
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [date, setDate] = useState('');
    
    useEffect(() => {
        setApplicationId(props.applicationId);
    }, [props.applicationId]);

    useEffect(() => {
        setUrl(props.url);
    }, [props.url]);

    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    useEffect(() => {
        setCompany(props.company);
    }, [props.company]);

    useEffect(() => {
        setRole(props.role);
    }, [props.role]);

    useEffect(() => {
        setDate(props.date);
    }, [props.date]);

     // NOTE: I dont know a way to use one Link tag and keep the styling the same
     return (
        <Grid item xs={12} margin='10px'>
            <Link to={`application/${applicationId}`} style={{textDecoration: 'none'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px', borderBottom: 1}}>                
                    <CardContent className='insideCard'>
                        <Grid container>
                            <Grid item xs={1}>
                                <CardMedia
                                    sx={{borderRadius:'100%', maxHeight: '50px', maxWidth: '50px'}}
                                    component='img'
                                    image={`${BASE_CLEARBIT_URL}${url}`}
                                    alt='company logo'
                                /> 
                            </Grid>
                            <Grid item xs={7} textAlign='left'>
                                <Typography id='title' variant='h4'>
                                    {title}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} textAlign='right'>
                                <Typography id='company' variant='h6'>
                                    {company}
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                
                            </Grid>
                            <Grid item xs={7} textAlign='left'>
                                <Typography id='role'>
                                    {role}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} textAlign='right'>
                                <Typography id='date'>
                                    {date}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Box>
            </Link>
        </Grid>
      );
}

export default UpcomingBox;