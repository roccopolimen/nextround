import { ReactElement, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Snackbar, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { Delete, Info, Event, Contacts, Description } from '@mui/icons-material';
import {
    useCreateContact,
    useCreateEvent,
    useCreateNote,
    useDeleteApplication,
    useDeleteContact,
    useDeleteEvent,
    useGetApplication,
    useUpdateApplication,
    useUpdateEvent
} from "api";
import { ApplicationObject } from "typings";
import Events from "components/JobSections/Events";
import JobDetails from "components/JobSections/JobDetails";
import MyContacts from "components/JobSections/MyContacts";
import MyNotes from "components/JobSections/MyNotes";
import Loading from "components/Loading";
import SideDrawer from "components/SideDrawer";
import Error from 'components/Error';

const Job = (): JSX.Element => {
    let params = useParams();
    const navigate = useNavigate();
    const [currTab, setCurrTab] = useState<number>(0);
    const [data, setData] = useState<ApplicationObject | undefined>(undefined);
    const [fetchApp, setFetchApp] = useState<boolean>(false);
    const [patchApp, setPatchApp] = useState<boolean>(false);
    const [shouldCreateEvent, setShouldCreateEvent] = useState<boolean>(false);
    const [shouldDeleteEvent, setShouldDeleteEvent] = useState<boolean>(false);
    const [shouldPatchEvent, setShouldPatchEvent] = useState<boolean>(false);
    const [shouldCreateContact, setShouldCreateContact] = useState<boolean>(false);
    const [shouldDeleteContact, setShouldDeleteContact] = useState<boolean>(false);
    const [shouldCreateNote, setShouldCreateNote] = useState<boolean>(false);
    const [hasNewData, setHasNewData] = useState<boolean>(false);
    const [component, setComponent] = useState<ReactElement<any, any> | undefined>(undefined);

    const [id, setId] = useState<string>(data ? data._id : "");
    const [company, setCompany] = useState<string>(data ? data.company : "");
    const [position, setPosition] = useState<string>(data ? data.position : "");
    const [location, setLocation] = useState<string>(data ? data.location : "");
    const [jobPostUrl, setJobPostUrl] = useState<string>(data ? data.jobPostUrl : "");
    const [description, setDescription] = useState<string>(data ? data.description : "");
    const [salary, setSalary] = useState<number>(data && data.salary ? data.salary : 0);
    const [cardColor, setCardColor] = useState<string>(data ? data.cardColor : "#fff");
    const [progress, setProgress] = useState<number>(data ? data.progress : 0);

    const [eventTitle, setEventTitle] = useState<string>("");
    const [eventDate, setEventDate] = useState<Date>(new Date());
    const [eventLocation, setEventLocation] = useState<string>("");

    const [eventId, setEventId] = useState<string>("");

    const [eventStatus, setEventStatus] = useState<boolean>(false);
    const [eventIdUpdate, setEventIdUpdate] = useState<string>("");

    const [contactName, setContactName] = useState<string>("");
    const [contactPhone, setContactPhone] = useState<string>("");
    const [contactEmail, setContactEmail] = useState<string>("");

    const [contactId, setContactId] = useState<string>("");

    const [note, setNote] = useState<string>("");

    const [snackOpen, setSnackOpen] = useState<boolean>(false);
    const [snackMessage, setSnackMessage] = useState<string>("");


    let appId: string = params.id ? params.id : "";

    // Responsive design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let details: string = mobile ? "" : "Details";
    let events: string = mobile ? "" : "Events";
    let contacts: string = mobile ? "" : "Contacts";
    let notes: string = mobile ? "" : "Notes";
    let tab_spacing: number = mobile ? 0 : 5;
    let h1Size: string = mobile ? "1rem": "2.5rem";
    let h2Size: string = mobile ? ".75rem": "2rem";
    let imgSize: number = mobile ? 45 : 75;

    // Queries & Mutations
    const { data: api_data, isLoading, isError, refetch: fetchApplication } = useGetApplication(appId);
    const { refetch: updateApplication } = useUpdateApplication(id, company, position, location, jobPostUrl,
                                                                    description, salary, cardColor, progress);
    const { refetch: createEvent } = useCreateEvent(appId, eventTitle, eventDate, eventLocation);
    const { refetch: deleteEvent } = useDeleteEvent(appId, eventId);
    const { refetch: updateEvent } = useUpdateEvent(appId, eventIdUpdate, eventStatus);
    const { refetch: createContact } = useCreateContact(appId, contactName, contactPhone, contactEmail);
    const { refetch: deleteContact } = useDeleteContact(appId, contactId);
    const { refetch: createNote } = useCreateNote(appId, note);
    const { refetch: deleteApplication } = useDeleteApplication(appId);

    useEffect(() => {
        // On mount
        fetchApplication();
        if(fetchApp) setFetchApp(false);
    }, [fetchApplication, appId, fetchApp]);

    useEffect(() => {
        if(!isLoading && api_data) {
            setData(api_data);
        }
    }, [isLoading, api_data]);

    useEffect(() => {
        // On data update
        setId(data ? data._id : "");
        setCompany(data ? data.company : "");
        setPosition(data ? data.position : "");
        setLocation(data ? data.location : "");
        setJobPostUrl(data ? data.jobPostUrl : "");
        setDescription(data ? data.description : "");
        setSalary(data && data.salary ? data.salary : 0);
        setCardColor(data ? data.cardColor : "#fff");
        setProgress(data ? data.progress : 0);
        setHasNewData(true);
    }, [data]);

    useEffect(() => {
        // Make the patch call
        const callApi = async () => {
            try {
                await updateApplication({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            
            await fetchApplication();
        }
        if(patchApp && hasNewData) {
            setPatchApp(false);
            callApi();
        }
    }, [patchApp, hasNewData, updateApplication, fetchApplication]);

    useEffect(() => {
        // Make the create event call
        const callApi = async () => {
            try {
                await createEvent({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            await fetchApplication();
        }

        if(shouldCreateEvent) {
            callApi();
            setShouldCreateEvent(false);
        }
    }, [eventTitle, eventDate, eventLocation, shouldCreateEvent,
         fetchApplication, createEvent]);

    useEffect(() => {
        // Make the delete event call
        const callApi = async () => {
            try {
                await deleteEvent({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            await fetchApplication();
        }

        if(shouldDeleteEvent) {
            callApi();
            setShouldDeleteEvent(false);
        }
    }, [eventId, shouldDeleteEvent, fetchApplication, deleteEvent]);

    useEffect(() => {
        // Make the update event call
        const callApi = async () => {
            try {
                await updateEvent({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            await fetchApplication();
        }

        if(shouldPatchEvent) {
            callApi();
        }
    }, [shouldPatchEvent, eventIdUpdate, eventStatus, fetchApplication,
         updateEvent]);

    useEffect(() => {
        // Make the create contact call
        const callApi = async () => {
            try {
                await createContact({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            await fetchApplication();
        }

        if(shouldCreateContact) {
            callApi();
            setShouldCreateContact(false);
        }
    }, [contactName, contactPhone, contactEmail, shouldCreateContact,
            fetchApplication, createContact]);

    useEffect(() => {
        // Make the delete contact call
        const callApi = async () => {
            try {
                await deleteContact({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            await fetchApplication();
        }

        if(shouldDeleteContact) {
            callApi();
            setShouldDeleteContact(false);
        }
    } , [contactId, shouldDeleteContact, fetchApplication, deleteContact]);

    useEffect(() => {
        // Make the create note call
        const callApi = async () => {
            try {
                await createNote({ throwOnError: true });
            } catch (e: any) {
                setSnackMessage(e ? e.data.message : "Something went wrong");
                setSnackOpen(true);
            }
            await fetchApplication();
        }

        if(shouldCreateNote) {
            callApi();
            setShouldCreateNote(false);
        }
    } , [note, shouldCreateNote, fetchApplication, createNote]);

    useEffect(() => {
        // On tab change

        // Props functions
        const updateApp = (data: ApplicationObject) => {
            setHasNewData(false);
            setData(data);
            setPatchApp(true);
        }

        const changeEvent = async (id: string, status: boolean) => {
            setEventIdUpdate(id);
            setEventStatus(status);
            setShouldPatchEvent(true);
        }

        const addEvent = (title: string, date: string,
                             location: string) => {
            setEventTitle(title);
            setEventDate(new Date(date));
            setEventLocation(location);
            setShouldCreateEvent(true);
        }

        const deleteEvent = (eventId: string) => {
            setEventId(eventId);
            setShouldDeleteEvent(true);
        }

        const addContact = (name: string, phone: string, email: string) => {
            setContactName(name);
            setContactPhone(phone);
            setContactEmail(email);
            setShouldCreateContact(true);
        }

        const deleteContact = (id: string) => {
            setContactId(id);
            setShouldDeleteContact(true);
        }

        const addNote = (note: string) => {
            setNote(note);
            setShouldCreateNote(true);
        }

        /**
         * @description Chooses the component to be rendered based on the tab
         * @returns {JSX.Element} The component to be rendered
         */
        const chooseComponent = (): JSX.Element => {
            switch (currTab) {
                case 0:
                    return <JobDetails data={data} update={updateApp} />;
                case 1:
                    return <Events data={data} update={changeEvent} addEvent={addEvent} deleteEvent={deleteEvent} />;
                case 2:
                    return <MyContacts data={data} addContact={addContact} deleteContact={deleteContact} />;
                case 3:
                    return <MyNotes data={data} addNote={addNote} />;
                default:
                    return <div>Error</div>;
            }
        };
        setComponent(data ? chooseComponent() : undefined);
    }, [currTab, data, fetchApplication, updateApplication]);

    /**
     * @description Changes the current tab
     * @param {React.SyntheticEvent} _event click information
     * @param {number} newValue new tab index
     */
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => setCurrTab(newValue);

    if(isLoading) return <Loading open={ true } />;
    else if(isError || !data) {
        return (
            <div>
                <SideDrawer />
                <Error />
            </div>
        );
    } else {
        return (
            <Box>
                <SideDrawer />
                {/* Header */}
                <Box sx={{ m: 3, mb: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box component="img" 
                        sx={{ mx: 5, height: imgSize, width: imgSize,
                            borderRadius: '50%' }} 
                        src={data.companyLogo}
                        alt={data.company} />
                    <div className="job-page-typography">
                        <Typography variant="h1" id="role"
                            sx={{ fontSize: h1Size }}
                            color="#ADA7BD">{data.position}</Typography>
                        <Typography variant="h2" id="company"
                            sx={{ fontSize: h2Size }}
                            color="#190446">{data.company}</Typography>
                    </div>
                    {/* delete button */}
                    <Button 
                        variant="contained"
                        aria-label="Delete"
                        onClick={async () => {
                            await deleteApplication();
                            // redirect to home page
                            navigate('/dashboard', { replace: false });
                        }}
                        color="error"
                        startIcon={<Delete />}
                        sx={{display:"flex"}}
                        className="right" />
                </Box>

                {/* Navigation tabs */}
                <Box sx={{ width: '100%', mx: 'auto',
                    borderBottom: '0.05rem solid #ADA7BD' }}>
                    <Tabs value={currTab}
                        onChange={handleChange}
                        variant="fullWidth"
                        aria-label="tab navigation">
                        <Tab icon={<Info style={{ fontSize: "medium" }} />}
                            iconPosition="start" 
                            label={details}
                            disableRipple
                            sx={{ mx: tab_spacing }} />
                        <Tab icon={<Event style={{ fontSize: "medium" }} />}
                            iconPosition="start" 
                            label={events}
                            sx={{ mx: tab_spacing }} />
                        <Tab icon={<Contacts style={{ fontSize: "medium" }} />}
                            iconPosition="start" 
                            label={contacts}
                            sx={{ mx: tab_spacing }} />
                        <Tab icon={<Description 
                            style={{ fontSize: "medium" }} />}
                            iconPosition="start" 
                            label={notes}
                            sx={{ mx: tab_spacing }} />
                    </Tabs>
                </Box>

                {/* The component for the selected tab */}
                <Box sx={{ width: '75%', mx: 'auto', mt: 2, mb: 1 }}>
                    {component}
                </Box>
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackOpen(false)}
                    sx={{ position: 'absolute', bottom: '0rem', left: '0rem' }}
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }
};

export default Job;