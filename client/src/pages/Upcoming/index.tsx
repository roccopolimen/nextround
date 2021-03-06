import './style.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    FormGroup,
    Grid,
    Modal,
    Slide,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Add } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useGetCurrentCycle, useCreateApplication } from "api";
import { ApplicationObject, UpcomingObject } from "typings";
import UpcomingBox from "components/UpcomingBox";
import JobCard from "components/JobCard";
import Loading from "components/Loading";
import SideDrawer from "components/SideDrawer";
import Error from 'components/Error';
import { checkNonEmptyString } from "helpers";

const Upcoming = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState<Array<ApplicationObject>>([]);
    const [orderUpcoming, setOrderUpcoming] = useState<Array<UpcomingObject>>([]);
    const [, setChanged] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [built, setBuilt] = useState<boolean>(false);

    const [addJobCompany, setAddJobCompany] = useState<string>('');
    const [addJobPosition, setAddJobPosition] = useState<string>('');
    const [addJobLocation, setAddJobLocation] = useState<string>('');
    const [addJobJobPostUrl, setAddJobJobPostUrl] = useState<string>('');
    const [addJobDescription, setAddJobDescription] = useState<string>('');
    const today = new Date();
    const [addApplyDate, setAddApplyDate] = useState<Date>(today);
    const [jobError, setJobError ] = useState<boolean>(false);
    let date_picker: JSX.Element | null = null;
    const [upcoming, setUpcoming] = useState<Array<JSX.Element | null>>([]);
    const [toApply, setToApply] = useState<Array<JSX.Element | undefined>>([]);
    const [applied, setApplied] = useState<Array<JSX.Element | undefined>>([]);
    const [rejected, setRejected] = useState<Array<JSX.Element | undefined>>([]);
    const [offered, setOffered] = useState<Array<JSX.Element | undefined>>([]);
    const [waitlisted, setWaitlisted] = useState<Array<JSX.Element | undefined>>([]);

    const {data: cycleData, isLoading: CycleIsLoading, isError: CycleIsError, refetch: fetchCurrentCycle}
        = useGetCurrentCycle();
    const { refetch: fetchCreateApplication}
        = useCreateApplication(addJobCompany, addJobPosition, addJobLocation,
                                addJobJobPostUrl, addJobDescription, addApplyDate);

    // Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    const img_size: string = mobile ? "200px" : "400px";

    useEffect(() => {
        // Fetch data on mount
        setBuilt(false);
        const fetchData = async () => {
            try {
                await fetchCurrentCycle({ throwOnError: true });
            } catch(e) {
                navigate('/create');
            }
        };
        fetchData();
    }, [fetchCurrentCycle, navigate]);

    useEffect(() => {
        // Set application data
        if (cycleData) {
            setApplications(cycleData.applications);
        }
    }, [cycleData]);

    useEffect(() => {
        // Used to get the information needed to display events in the proper order
        let obj: any = {};
        let sortedObj: any = {};
        for(let application of applications) {
            for(let event of application.events) {
                obj[`${event._id} ${new Date(event.date).getTime()} ${event.title}`] = {
                    eventId: event._id,
                    applicationId: application._id, 
                    companyLogo: application.companyLogo, 
                    company: application.company, 
                    role: application.position, 
                    date: new Date(event.date), 
                    title: event.title,
                    status: event.status,
                };
            }
        }

        Object.keys(obj).sort((a: string, b: string) => {
            const time1: number = parseInt(a.split(' ')[1]);
            const time2: number = parseInt(b.split(' ')[1]);
            return time1 - time2;
        }).forEach(key => sortedObj[key] = obj[key]);
        setOrderUpcoming(Object.values(sortedObj));

        // Set the structure
        const buildJobCards = (application: ApplicationObject) => {
            return <JobCard
                        key={`jobcard ${application._id}`}
                        applicationId={application._id}
                        url={application.companyLogo}
                        company={application.company}
                        role={application.position}
                        color={application.cardColor}
            />;
        };
    
        setToApply(applications &&
            applications.map((application) => {
                let notApplied: boolean = true;
                for(let event of application.events) {
                    if(event.title === "Apply" && event.status) {
                        notApplied = false;
                        break;
                    }
                }
                if(notApplied) return buildJobCards(application);
                return undefined;
            }).filter(application => application !== undefined)
        );
    
        setApplied(applications &&
            applications.map((application) => {
                if(application.progress !== 0) return undefined;
                for(let event of application.events) {
                    if(event.title === "Apply") {
                        if(event.status) return buildJobCards(application);
                        else return undefined;
                    }
                }
                return undefined;
            }).filter(application => application !== undefined)
        );
    
        setRejected(applications &&
            applications.map((application) => {
                if(application.progress !== 2) return undefined;
                for(let event of application.events) {
                    if(event.title === "Apply") {
                        if(event.status) return buildJobCards(application);
                        else return undefined;
                    }
                }
                return undefined;
            }).filter(application => application !== undefined)
        );
    
        setOffered(applications &&
            applications.map((application) => {
                if(application.progress !== 1) return undefined;
                for(let event of application.events) {
                    if(event.title === "Apply") {
                        if(event.status)  return buildJobCards(application);
                        else return undefined;
                    }
                }
                return undefined;
            }).filter(application => application !== undefined)
        );

        setWaitlisted(applications &&
            applications.map((application) => {
                if(application.progress !== 3) return undefined;
                for(let event of application.events) {
                    if(event.title === "Apply") {
                        if(event.status) return buildJobCards(application);
                        else return undefined;
                    }
                }
                return undefined;
            }).filter(application => application !== undefined)
        );

        setBuilt(true);
    }, [applications]);

    useEffect(() => {
        const today: Date = new Date();
        today.setDate(today.getDate());
        today.setHours(0, 0, 0, 0);
        const buildUpcomingBox = (upcoming: UpcomingObject) => {
            if(upcoming.date.getTime() < today.getTime() || upcoming.status === true) return null;
            return <UpcomingBox 
                        key={`upcoming ${upcoming.eventId}`}
                        applicationId={upcoming.applicationId}
                        url={upcoming.companyLogo}
                        company={upcoming.company}
                        role={upcoming.role}
                        date={upcoming.date}
                        title={upcoming.title}
            />;
        };

        setUpcoming(orderUpcoming &&
            orderUpcoming
            .map(upcoming => buildUpcomingBox(upcoming))
            .filter(upcoming => upcoming !== null)
        );
    }, [orderUpcoming]);

    const handleAddJob = async() => {
        try{
            if(!checkNonEmptyString(addJobCompany) || !checkNonEmptyString(addJobPosition)
            || !checkNonEmptyString(addJobLocation) || !checkNonEmptyString(addJobJobPostUrl)
            || !checkNonEmptyString(addJobDescription)) {
                setJobError(true);
            } else {
                setJobError(false);
                await fetchCreateApplication({ throwOnError: true });
                await fetchCurrentCycle({ throwOnError: true });
                setChanged(true);
                setOpen(false);
                
                setAddJobCompany('');
                setAddJobPosition('');
                setAddJobLocation('');
                setAddJobJobPostUrl('');
                setAddJobDescription('');

                setChanged(false);
            }
        } catch(e) {
            setJobError(true);
        }
    };

    /**
        * @description Create a proper date picker given the device type
        * @param {boolean} mobile if the device is mobile
        * @returns {JSX.Element | undefined} date picker
        */
     const buildDatePicker = (mobile: boolean): JSX.Element => {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box m={2}>
                    {mobile ?
                        <MobileDatePicker
                            label="Date"
                            inputFormat="MM/dd/yyyy"
                            value={addApplyDate}
                            onChange={(value: Date | null, _key) => 
                                value ? setAddApplyDate(value) : null}
                            renderInput={(params) => <TextField {...params} />}
                        /> :
                        <DesktopDatePicker
                            label="Date"
                            inputFormat="MM/dd/yyyy"
                            value={addApplyDate}
                            onChange={(value: Date | null, _key) => 
                                value ? setAddApplyDate(value) : null}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    }
                </Box>
            </LocalizationProvider>
        );  
    }

    date_picker = buildDatePicker(mobile);

    if(CycleIsLoading || !built) {
        return <Loading open={ true } />;
    } else if(CycleIsError) {
        return <Error />;
    } else {
        return (
            <>       
                <SideDrawer /> 
                <Grid container className='grid' spacing={5} justifyContent="space-around" alignItems="stretch">
                    <Slide direction='right' in={true} timeout={800}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} justifyContent="center" alignItems="center" >
                            <br/>
                            <Typography
                                id="title"
                                variant='h1'
                                margin='20px'
                                sx={{
                                    fontSize: '24pt',
                                    fontWeight: 'bold'
                                }}
                            >Upcoming</Typography>
                            {/* Add Job Button */}
                            <Box sx={{ marginLeft: '65%', justifyContent: "right", alignItems: "right" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => setOpen(true)}
                                >Add Job</Button>
                            </Box>
                            <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="Add job form">
                                <FormGroup 
                                    sx={{
                                        position: 'absolute',
                                        top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '50%', bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        padding: 1
                                    }}
                                >
                                    <Typography variant="h4">Job Details</Typography>
                                    <TextField required id="job-company" variant="outlined"
                                        label="Company" size="small" value={addJobCompany}
                                        margin='normal'
                                        onChange={(e) => setAddJobCompany(e.target.value)} />
                                    <TextField required id="job-position" variant="outlined"
                                        label="Position" size="small" value={addJobPosition}
                                        margin='normal'
                                        onChange={(e) => setAddJobPosition(e.target.value)} />
                                    <TextField required id="job-location" variant="outlined"
                                        label="Location" size="small" value={addJobLocation}
                                        margin='normal'
                                        onChange={(e) => setAddJobLocation(e.target.value)} />
                                    <TextField required id="job-jobposturl" variant="outlined"
                                        label="Job Post Url" size="small" value={addJobJobPostUrl}
                                        margin='normal'
                                        onChange={(e) => setAddJobJobPostUrl(e.target.value)} />
                                    <TextField required id="job-description" variant="outlined"
                                        label="Description" size="small" value={addJobDescription}
                                        margin='normal'
                                        onChange={(e) => setAddJobDescription(e.target.value)} />
                                    {date_picker && date_picker}
                                    <Button variant="contained" color="primary"
                                        startIcon={<Add />}
                                        sx={{ mt: 2, width: '50%', mx: 'auto' }}
                                        onClick={handleAddJob}
                                    >Submit</Button>
                                    {jobError && <Alert sx={{mt: 1}} severity="error">Error: Make sure you have a current cycle and that all fields are properly filled out</Alert>}
                                </FormGroup>
                            </Modal>
                            <br/>
                            {upcoming && upcoming.length > 0 
                                ? upcoming
                                :
                                <Box sx={{ margin: 'auto', width: "50%" }}>
                                    <Box component="img"
                                    src={require('../../images/read_relax.png')}
                                    width={img_size} height={img_size} alt="Relax" />
                                    <Typography variant="body1" sx={{ ml: 2, fontSize: '18pt' }}>
                                        No upcoming events.
                                    </Typography>
                                </Box>
                            }
                        </Grid>
                    </Slide>
                    <Slide direction='left' in={true} timeout={800}>
                        <Grid item xs={12} sm={8} md={6} lg={4} xl={4}
                            justifyContent="center"
                            alignItems="center"
                            marginTop='150px'
                            marginBottom='150px'
                        >
                            {toApply && toApply.length > 0 ? 
                                <Accordion sx={{ mb: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}>
                                        <Typography>To Apply</Typography> 
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {toApply}
                                    </AccordionDetails>
                                </Accordion> : null
                            }

                            {applied && applied.length > 0 ?
                                <Accordion sx={{ mb: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Applied</Typography> 
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {applied}
                                    </AccordionDetails>
                                </Accordion> : null
                            }

                            {rejected && rejected.length > 0 ? 
                                <Accordion sx={{ mb: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Rejected</Typography> 
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {rejected}
                                    </AccordionDetails>
                                </Accordion> : null
                            }
                            
                            {offered && offered.length > 0 ? 
                                <Accordion sx={{ mb: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Offered</Typography> 
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {offered}
                                    </AccordionDetails>
                                </Accordion> : null
                            }
                            
                            {waitlisted && waitlisted.length > 0 ? 
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Waitlisted</Typography> 
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {waitlisted}
                                    </AccordionDetails>
                                </Accordion> : null
                            }
                        </Grid>
                    </Slide>
                </Grid>
            </>
        );
    };
    
};

export default Upcoming;