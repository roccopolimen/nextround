// import './style.css'
import { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import JobCard from 'components/JobCard';

const JobCardList = (props: {title: string}) => {
    const [title, setTitle] = useState('');

    useEffect(() => {
        setTitle(props.title);
    }, [props.title]);

    return(
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                <Typography>{title}</Typography> 
            </AccordionSummary>
            <AccordionDetails>
                <JobCard url={'google.com'} company={'Google'} role={'Software Engineer'} color={'#F6C92E'}/>
                <JobCard url={'spotify.com'} company={'Spotify'} role={'Data Scientist'} color={'#76D27C'}/> 
                <JobCard url={'netflix.com'} company={'Netflix'} role={'Software Engineer'} color={'#ED717D'}/> 
            </AccordionDetails>
        </Accordion>
    );
}

export default JobCardList;