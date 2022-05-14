import './style.css'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Grid, Box, CardMedia, CardContent, Typography } from '@mui/material';

const UpcomingBox = (props: {applicationId: string, url: string, title: string, company: string, role: string, date: Date}) => {

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
        const thisDate: string = ((props.date.getMonth() > 8) ? (props.date.getMonth() + 1) : ('0' + (props.date.getMonth() + 1))) + '/' + ((props.date.getDate() > 9) ? props.date.getDate() : ('0' + props.date.getDate())) + '/' + props.date.getFullYear()
        setDate(thisDate);
    }, [props.date]);

     // NOTE: I dont know a way to use one Link tag and keep the styling the same
     return (
        <Grid item xs={12} margin='10px'>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px', borderBottom: 1}}>            
                
                    <CardContent className='insideCard'>
                        <Grid container>
                            <Grid item xs={1} >
                                <CardMedia
                                    sx={{borderRadius:'100%', maxHeight: '50px', maxWidth: '50px', mr: 1}}
                                    component='img'
                                    image={`${url}`}
                                    alt='company logo'
                                />
                            </Grid>
                            <Grid item xs={7} textAlign='left'>
                                <Link to={`/application/${applicationId}`} style={{textDecoration: 'none'}}>
                                    <Typography id='title' variant='h2' sx={{ ml: 1 }}>
                                        {title}
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={4} textAlign='right'>
                                <Typography id='company' variant='h3'>
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
        </Grid>
      );
}

export default UpcomingBox;