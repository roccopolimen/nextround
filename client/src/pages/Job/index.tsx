import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Info, Event, Contacts, Description } from '@mui/icons-material';
import JobDetails from "components/JobSections/JobDetails";
import { ApplicationObject, EventObject } from "typings";
import Events from "components/JobSections/Events";

export default function Job() {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';
    // State variables
    const [currTab, setCurrTab] = useState(0);
    const [data, setData] = useState(
        undefined as ApplicationObject | undefined);
    const [url, setUrl] = useState(""); // TODO: remove when clearbit is ready
    const [component, setComponent] = useState(undefined as
                                     ReactElement<any, any> | undefined);

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

    useEffect(() => {
        // On mount

        // TODO: make api call to get job info
        let event1: EventObject = {
            _id: "1",
            title: "Apply",
            status: true,
            date: new Date("2020-01-01"),
            location: "Location 1"
        };
        let event2: EventObject = {
            _id: "2",
            title: "Super long event name that is an interview wooooooooooooo",
            status: false,
            date: new Date("2020-01-15"),
            location: "Location 2"
        };
        let event3: EventObject = {
            _id: "3",
            title: "Final round",
            status: false,
            date: new Date("2023-02-20"),
            location: "Mountain View, CA"
        };

        setData({
            _id: "5e9f9f9f9f9f9f9f9f9f9f9",
            company: "Google",
            position: "Software Engineer",
            location: "Mountain View, CA",
            salary: 100000,
            cardColor: "#efc920",
            progress: 0,
            jobPostUrl: "https://www.google.com/",
            description: "L4 engineering role at Google; no referral",
            notes: [],
            events: [event1, event2, event3],
            contacts: []
        });
        setUrl("google.com");
    }, []);

    useEffect(() => {
        // On tab change
        const chooseComponent = () => {
            switch (currTab) {
                case 0:
                    return (
                        <JobDetails data={data}
                                    update={setData} />
                    );
                case 1:
                    return (<Events data={data}
                                    update={setData} />);
                case 2:
                    return <div>Contacts</div>;
                case 3:
                    return <div>Notes</div>;
                default:
                    return <div>Error</div>;
            }
        };
        setComponent(data ? chooseComponent() : undefined);
    }, [currTab, data]);

    /**
     * Changes the current tab
     * @param {React.SyntheticEvent} event click information
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