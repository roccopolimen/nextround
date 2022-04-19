// import './style.css'
// import { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { JobCard } from 'components/JobCard';

export const JobCardList = () => {
    // // Constants
    // const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // // State variables
    // const [url, setUrl] = useState('google.com');
    // const [company, setCompany] = useState('Google');
    // const [role, setRole] = useState('Software Engineer');
    // const [color, setColor] = useState('#F6C92E');

    // useEffect(() => {

    //     setUrl('google.com');
    //     setCompany('Google');
    //     setRole('Software Engineer');
    //     setColor('#F6C92E');

    // }, []);

    return(
        <Grid container spacing={2} direction='column' justifyContent='center' alignItems='stretch' style={{ margin: '20px', width: '20%', border: '2px solid black'}}> Applied 
            <JobCard url={'google.com'} company={'Google'} role={'Software Engineer'} color={'#F6C92E'}/>
            <JobCard url={'spotify.com'} company={'Spotify'} role={'Data Scientist'} color={'#76D27C'}/> 
            <JobCard url={'netflix.com'} company={'Netflix'} role={'Software Engineer'} color={'#ED717D'}/> 
        </Grid>
    );

   
}