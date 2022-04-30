import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Info, Event, Contacts, Description } from '@mui/icons-material';
import JobDetails from "components/JobSections/JobDetails";
import { ApplicationObject } from "typings";
import Events from "components/JobSections/Events";
import { useCreateEvent, useDeleteEvent, useGetApplication, useUpdateApplication, useUpdateEvent } from "api";
import { useParams } from "react-router-dom";

export default function Job() {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';
    let params = useParams();
    // State variables
    const [currTab, setCurrTab] = useState(0);
    const [data, setData] = useState(
        undefined as ApplicationObject | undefined);
    const [url, setUrl] = useState("");
    const [patchApp, setPatchApp] = useState(false);
    const [shouldCreateEvent, setShouldCreateEvent] = useState(false);
    const [shouldDeleteEvent, setShouldDeleteEvent] = useState(false);
    const [shouldPatchEvent, setShouldPatchEvent] = useState(false);
    const [hasNewData, setHasNewData] = useState(false);
    const [component, setComponent] = useState(undefined as
                                     ReactElement<any, any> | undefined);
    // State variables for mutation
    const [id, setId] = useState(data ? data._id : "");
    const [company, setCompany] = useState(data ? data.company : "");
    const [position, setPosition] = useState(data ? data.position : "");
    const [location, setLocation] = useState(data ? data.location : "");
    const [jobPostUrl, setJobPostUrl] = useState(data ? data.jobPostUrl : "");
    const [description, setDescription] = useState(
                                            data ? data.description : "");
    const [salary, setSalary] = useState(data && data.salary ? data.salary : 0);
    const [cardColor, setCardColor] = useState(data ? data.cardColor : "#fff");
    const [progress, setProgress] = useState(data ? data.progress : 0);

    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState(new Date().toLocaleDateString());
    const [eventLocation, setEventLocation] = useState("");

    const [eventId, setEventId] = useState("");

    const [eventStatus, setEventStatus] = useState(false);
    const [eventIdUpdate, setEventIdUpdate] = useState("");


    let appId: string = params.id ? params.id : "";

    // Responsive design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let details: string = mobile ? "" : "Details";
    let events: string = mobile ? "" : "Events";
    let contacts: string = mobile ? "" : "Contacts";
    let notes: string = mobile ? "" : "Notes";
    let tab_spacing: number = mobile ? 0 : 5;
    let iconSize: string = mobile ? "small" : "medium";
    let h1Size: string = mobile ? "1rem": "2.5rem";
    let h2Size: string = mobile ? ".75rem": "2rem";
    let imgSize: number = mobile ? 45 : 75;

    // Queries & Mutations
    const { data: api_data, isLoading,
         refetch: fetchApplication } = useGetApplication(appId);
    const { refetch: updateApplication } = useUpdateApplication(id, company,
         position, location, jobPostUrl, description, salary,
         cardColor, progress);
    const { refetch: createEvent } = useCreateEvent(appId, eventTitle,
                                                 eventDate, eventLocation);
    const { refetch: deleteEvent } = useDeleteEvent(appId, eventId);
    const { refetch: updateEvent } = useUpdateEvent(appId,
        eventIdUpdate, eventStatus);
         
    // TODO: Delete application button

    useEffect(() => {
        // On mount
        fetchApplication();
        // TODO: clearbit logo from backend
        setUrl("google.com");
    }, [fetchApplication]);

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
            await updateApplication();
            await fetchApplication();
        }
        if(patchApp && hasNewData) {
            setPatchApp(false);
            callApi();
        }
    }, [patchApp, hasNewData, updateApplication, fetchApplication]);

    useEffect(() => {
        const callApi = async () => {
            await createEvent();
            await fetchApplication();
        }

        if(shouldCreateEvent) {
            callApi();
            setShouldCreateEvent(false);
        }
    }, [eventTitle, eventDate, eventLocation, shouldCreateEvent,
         fetchApplication, createEvent]);

    useEffect(() => {
        const callApi = async () => {
            await deleteEvent();
            await fetchApplication();
        }

        if(shouldDeleteEvent) {
            callApi();
            setShouldDeleteEvent(false);
        }
    }, [eventId, shouldDeleteEvent, fetchApplication, deleteEvent]);

    useEffect(() => {
        const callApi = async () => {
            await updateEvent();
            await fetchApplication();
        }

        if(shouldPatchEvent) {
            callApi();
        }
    }, [shouldPatchEvent, eventIdUpdate, eventStatus, fetchApplication,
         updateEvent]);

    useEffect(() => {
        // On tab change
        const updateApp = (data: ApplicationObject) => {
            setHasNewData(false);
            setData(data);
            setPatchApp(true);
        }

        const changeEvent = (id: string, status: boolean) => {
            console.log(status);
            setEventIdUpdate(id);
            setEventStatus(status);
            setShouldPatchEvent(true);
        }

        const addEvent = (title: string, date: string,
                             location: string) => {
            setEventTitle(title);
            setEventDate(date);
            setEventLocation(location);
            setShouldCreateEvent(true);
        }

        const deleteEvent = (eventId: string) => {
            setEventId(eventId);
            setShouldDeleteEvent(true);
        }
        const chooseComponent = () => {
            switch (currTab) {
                case 0:
                    return (
                        <JobDetails data={data}
                                    update={updateApp} />
                    );
                case 1:
                    return (<Events data={data}
                                    update={changeEvent}
                                    addEvent={addEvent}
                                    deleteEvent={deleteEvent} />);
                case 2:
                    return <div>Contacts</div>;
                case 3:
                    return <div>Notes</div>;
                default:
                    return <div>Error</div>;
            }
        };
        setComponent(data ? chooseComponent() : undefined);
    }, [currTab, data, fetchApplication, updateApplication]);

    /**
     * Changes the current tab
     * @param {React.SyntheticEvent} _event click information
     * @param {number} newValue new tab index
     */
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrTab(newValue);
    };

    // TODO: handle errors
    if(!data) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                {/* Header */}
                <Box sx={{ display: 'flex', mt: 3, mb: 1 }}>
                    <Box component="img" 
                        sx={{ mx: 5, height: imgSize, width: imgSize,
                            borderRadius: '50%' }} 
                        src={`${BASE_CLEARBIT_URL}${url}`}
                        alt={data.company} />
                    <div className="job-page-typography">
                        <Typography variant="h1" id="role"
                            sx={{ fontSize: h1Size }}
                            color="#190446">{data.position}</Typography>
                        <Typography variant="h2" id="company"
                            sx={{ fontSize: h2Size }}
                            color="#ADA7BD">{data.company}</Typography>
                    </div>
                </Box>

                {/* Navigation tabs */}
                <Box sx={{ width: '100%', mx: 'auto',
                    borderBottom: '0.05rem solid #ADA7BD' }}>
                    <Tabs value={currTab}
                        onChange={handleChange}
                        variant="fullWidth"
                        aria-label="tab navigation">
                        <Tab icon={<Info style={{ fontSize: iconSize }} />}
                            iconPosition="start" 
                            label={details}
                            disableRipple
                            sx={{ mx: tab_spacing }} />
                        <Tab icon={<Event style={{ fontSize: iconSize }} />}
                            iconPosition="start" 
                            label={events}
                            sx={{ mx: tab_spacing }} />
                        <Tab icon={<Contacts style={{ fontSize: iconSize }} />}
                            iconPosition="start" 
                            label={contacts}
                            sx={{ mx: tab_spacing }} />
                        <Tab icon={<Description 
                            style={{ fontSize: iconSize }} />}
                            iconPosition="start" 
                            label={notes}
                            sx={{ mx: tab_spacing }} />
                    </Tabs>
                </Box>

                {/* The component for the selected tab */}
                <Box sx={{ width: '75%', mx: 'auto', mt: 2, mb: 1 }}>
                    {component}
                </Box>
            </div>
        );
    }
};