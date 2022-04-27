import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Info, Event, Contacts, Description } from '@mui/icons-material';
import JobDetails from "components/JobSections/JobDetails";
import { ApplicationObject } from "typings";
import Events from "components/JobSections/Events";
import { useGetApplication, useUpdateApplication } from "api";
import { useParams } from "react-router-dom";

export default function Job() {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';
    let params = useParams();
    // State variables
    const [currTab, setCurrTab] = useState(0);
    const [data, setData] = useState(
        undefined as ApplicationObject | undefined);
    const [url, setUrl] = useState(""); // TODO: remove when clearbit is ready
    const [component, setComponent] = useState(undefined as
                                     ReactElement<any, any> | undefined);
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
    const { data: updateResult, isLoading: updateLoad,
         refetch: updateApplication } = useUpdateApplication(
             data ? data._id : "",
             data ? data.company : "",
             data ? data.position : "",
             data ? data.location : "",
             data ? data.jobPostUrl : "",
             data ? data.description : "",
             data && data.salary ? data.salary : 0,
             data ? data.cardColor : "",
             data ? data.progress : 0
    ); 
         

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
        // On tab change
        const updateData = (data: ApplicationObject) => {
            setData(data);
            updateApplication();
            fetchApplication();
        }
        const chooseComponent = () => {
            switch (currTab) {
                case 0:
                    return (
                        <JobDetails data={data}
                                    update={updateData} />
                    );
                case 1:
                    return (<Events data={data}
                                    update={updateData} />);
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