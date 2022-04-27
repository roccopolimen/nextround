import './style.css'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

const UpcomingBox = (props: any) => {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // State variables
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [date, setDate] = useState('');
    

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
        <Grid item xs={12}>
            <Link to={'/'} style={{textDecoration: 'none'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px', borderBottom: 1}}>
                    <CardMedia
                        sx={{borderRadius:'100%', maxHeight: '50px', maxWidth: '50px'}}
                        component='img'
                        image={`${BASE_CLEARBIT_URL}${url}`}
                        alt='company logo'
                    /> 
                
                <CardContent className='insideCard'>
                    <Typography>
                        {title}
                    </Typography>
                    <Typography>
                        {company}
                    </Typography>
                    <Typography>
                        {role}
                    </Typography>
                    <Typography>
                        {date}
                    </Typography>
                </CardContent>
                </Box>
            </Link>
        </Grid>
      );
}

export default UpcomingBox;