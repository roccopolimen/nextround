import UpcomingBox from "components/UpcomingBox";
import JobCard from "components/JobCard";
import { useGetCurrentCycle } from "api";
import { useEffect, useState } from "react";

import { Grid, Box, Card, CardMedia, CardContent, Typography, Slide, AppBar, Button } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import './style.css';
import { ApplicationObject, UpcomingObject } from "typings";

const Upcoming = () => {
    const [applications, setApplications] = useState([] as ApplicationObject[]);
    const [orderUpcoming, setOrderUpcoming] = useState([]);
    let upcoming = null;
    let toApply = null;
    let applied = null;
    

    const {data: cycleData, isLoading: CycleIsLoading, isError: CycleIsError, refetch: fetchCurrentCycle} = useGetCurrentCycle();

    useEffect(() => {
        // Fetch data on mount
        const fetchData = async () => {
            await fetchCurrentCycle();
        };
        fetchData();
    }, [fetchCurrentCycle]);

    useEffect(() => {
        if (cycleData) {
            setApplications(cycleData.applications);
        }
    }, [cycleData])

    useEffect(() => {
        let obj: any = {};
        let sortedObj: any = {};
        for(let application of applications){
            for(let event of application.events){
                obj[new Date(event.date).getTime()] = {companyLogo: application.companyLogo, company: application.company, role: application.position, date: event.date, title: event.title}
            }
        }
        Object.keys(obj).sort(function(a: any, b: any){return a-b}).forEach( 
            key => {
            sortedObj[key] = obj[key];
        });
        setOrderUpcoming(Object.values(sortedObj));
        
    }, [applications]);


    const buildUpcomingBox = (upcoming: UpcomingObject) => {
        return (
            <UpcomingBox url={upcoming.companyLogo} company={upcoming.company} role={upcoming.role} date={upcoming.date} title={upcoming.title} />
        );
    };
    upcoming = orderUpcoming && orderUpcoming.map((upcoming) => {
        return buildUpcomingBox(upcoming);
    });

    const buildJobCards = (application: ApplicationObject) => {
        return (
            <JobCard url={application.companyLogo} company={application.company} role={application.position} color={application.cardColor}/>
        );
    };
    toApply = applications && applications.map((application) => {
        for(let event of application.events){
            if(event.status === true){
                return buildJobCards(application);
            }
        }
    });

    applied = applications && applications.map((application) => {
        for(let event of application.events){
            if(event.status === true){
                return buildJobCards(application);
            }
        }
    });

    

    if(CycleIsLoading) {
        return <div>Loading...</div>;
    } else if(CycleIsError) {
        return <div>Error...</div>;
    } else {
        return (
            <>          
                <Grid container className='grid' spacing={5} justifyContent="space-around" alignItems="stretch">
                    <Slide direction='right' in={true} timeout={800}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} justifyContent="center" alignItems="center" >
                            <br/>
                            <Typography className="title" variant='h3'>Upcoming</Typography>
                            <br/>
                            {upcoming}
                        </Grid>
                    </Slide>
                    <Slide direction='left' in={true} timeout={800}>
                        <Grid item xs={12} sm={8} md={6} lg={4} xl={4} justifyContent="center" alignItems="center">
                            <br/>
                            <br/>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header">
                                    <Typography>To Apply</Typography> 
                                </AccordionSummary>
                                <AccordionDetails>
                                    <JobCard url={'google.com'} company={'Google'} role={'Software Engineer'} color={'#F6C92E'}/>
                                    
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header">
                                    <Typography>Apply</Typography> 
                                </AccordionSummary>
                                <AccordionDetails>
                                    <JobCard url={'google.com'} company={'Google'} role={'Software Engineer'} color={'#F6C92E'}/>
                                    
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Slide>
                </Grid>
            </>
        );
    };
    
};

export default Upcoming;