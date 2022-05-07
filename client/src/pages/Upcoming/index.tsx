import UpcomingBox from "components/UpcomingBox";
import JobCard from "components/JobCard";
import { useGetCurrentCycle } from "api";
import { useEffect, useState } from "react";

import { AppBar, Box, Button, Card, CardContent, CardMedia, FormGroup, Grid, Modal, Slide, TextField, Typography} from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Save, Add, Delete } from '@mui/icons-material';

import './style.css';
import { ApplicationObject, UpcomingObject } from "typings";

const Upcoming = () => {
    const [applications, setApplications] = useState([] as ApplicationObject[]);
    const [orderUpcoming, setOrderUpcoming] = useState([]);
    const [changed, setChanged] = useState(false);
    const [open, setOpen] = useState(false);
    const [addJobCompany, setAddJobCompany] = useState('');
    const [addJobPosition, setAddJobPosition] = useState('');
    const [addJobLocation, setAddJobLocation] = useState('');
    const [addJobJobPostUrl, setAddJobJobPostUrl] = useState('');
    const [addJobDescription, setAddJobDescription] = useState('');
    
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
        // Set application data
        if (cycleData) {
            setApplications(cycleData.applications);
        }
    }, [cycleData])

    useEffect(() => {
        // Used to get the information needed to display events in the proper order
        let obj: any = {};
        let sortedObj: any = {};
        for(let application of applications){
            for(let event of application.events){
                obj[new Date(event.date).getTime()] = 
                {
                    applicationId: application._id, 
                    companyLogo: application.companyLogo, 
                    company: application.company, 
                    role: application.position, 
                    date: event.date, title: 
                    event.title
                }
            }
        }
        Object.keys(obj).sort(function(a: any, b: any){return a-b}).forEach( 
            key => {
            sortedObj[key] = obj[key];
        });
        setOrderUpcoming(Object.values(sortedObj));
        
    }, [applications]);

    const handleAddJob = () => {
        if(title === "" || location === "") return;
        if (data && selectedDate) {
            props.addEvent(title, selectedDate.toLocaleDateString(), location);
            setChanged(true);
            setOpen(false);
            setChanged(false);
        }
    };

    const buildUpcomingBox = (upcoming: UpcomingObject) => {
        return (
            <UpcomingBox applicationId={upcoming.applicationId} url={upcoming.companyLogo} company={upcoming.company} role={upcoming.role} date={upcoming.date} title={upcoming.title} />
        );
    };
    const buildJobCards = (application: ApplicationObject) => {
        return (
            <JobCard applicationId={application._id} url={application.companyLogo} company={application.company} role={application.position} color={application.cardColor}/>
        );
    };

    upcoming = orderUpcoming && orderUpcoming.map((upcoming) => {
        return buildUpcomingBox(upcoming);
    });

    toApply = applications && applications.map((application) => {
        let notApplied = true;
        for(let event of application.events){
            if(event.status === true){
                notApplied = false;
                break;
            }
        }
        if(notApplied){
            return buildJobCards(application);
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

                            {/* Add Job Button */}
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ justifyContent: "flex-end",
                                            alignItems: "flex-end"}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Add />}
                                        onClick={() => setOpen(true)}
                                    >
                                        Add Job
                                    </Button>
                                </Box>
                            </Box>
                            <Modal open={open} onClose={() => setOpen(false)}
                                aria-labelledby="Add event form" >
                                <FormGroup sx={{ position: 'absolute', top: '50%', left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '50%', bgcolor: 'background.paper',
                                                boxShadow: 24,
                                                padding: 1}}>
                                    <Typography variant="h4"
                                                sx={{ width: '50%', mx: 'auto' }}>
                                        Event Details
                                    </Typography>
                                    <TextField required id="event-title" variant="outlined"
                                        label="Event Title" size="small" value={title}
                                        onChange={(e) => setTitle(e.target.value)} />
                                    <TextField required id="location-value" variant="outlined"
                                        label="Location" size="small" value={location}
                                        onChange={(e) => setLocation(e.target.value)} />
                                    <Button variant="contained" color="primary"
                                        startIcon={<Add />}
                                        sx={{ mt: 2, width: '50%', mx: 'auto' }}
                                        onClick={handleAddJob}
                                    >
                                        Submit
                                    </Button>
                                </FormGroup>
                            </Modal>

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
                                    {toApply}
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
                                    {applied}
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