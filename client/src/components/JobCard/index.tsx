import './style.css'
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Grid, Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

interface PropType {
    applicationId: string,
    url: string,
    company: string,
    role: string,
    color: string
};

const JobCard = (props: PropType): JSX.Element => {

    // State variables
    const [applicationId, setApplicationId] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [company, setCompany] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [color, setColor] = useState<string>('');

    useEffect(() => {
        setApplicationId(props.applicationId);
    }, [props.applicationId]);

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
    
    return (
        <Grid item xs={12}>
            <Link to={`/application/${applicationId}`} style={{textDecoration: 'none'}}>
                <Card className='card' style={{ backgroundColor: color }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', margin: '10px'}}>
                        <CardMedia
                            className='image'
                            component='img'
                            src={url}
                            onError={({ currentTarget }: { currentTarget: any }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = require('../../images/no-company-logo.png');
                            }}
                            alt='company logo'
                            sx={{ width: '60px', height: '60px' }}
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
};

export default JobCard;