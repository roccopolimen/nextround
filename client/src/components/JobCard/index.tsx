import './style.css'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardContent, Typography } from '@mui/material';


const JobCard = (props: any) => {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // State variables
    const [url, setUrl] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        setUrl(props.url);
    }, [props.url]);

    useEffect(() => {
        setCompany(props.company);
    }, [props.company]);

    useEffect(() => {
        setRole(props.role);
    }, [props.role]);

    useEffect(() => {
        setColor(props.color);
    }, [props.color]);

     // NOTE: I dont know a way to use one Link tag and keep the styling the same
     return (
        <Grid item xs={12}>
            <Link to={'/'} style={{textDecoration: 'none'}}>
                <Card className='card' style={{ backgroundColor: color }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px'}}>
                        <CardMedia
                            className='image'
                            component='img'
                            image={`${BASE_CLEARBIT_URL}${url}`}
                            alt='company logo'
                        /> 
                    </Box>
                    <CardContent className='insideCard'>
                        <Typography className='company' component="div" variant="h5">
                            {company}
                        </Typography>
                        <Typography className='role' variant="subtitle1" component="div">
                            {role}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        </Grid>
      );
}

export default JobCard;