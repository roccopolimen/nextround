import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Info, Event, Contacts, Description } from '@mui/icons-material';
import JobDetails from "components/JobSections/JobDetails";
import { ApplicationObject } from "typings";

export default function Job() {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // State variables
    const emptyApplication: ApplicationObject = {
        _id: "",
        company: "",
        position: "",
        location: "",
        salary: 0,
        cardColor: "",
        progress: 0,
        jobPostUrl: "",
        description: "",
        notes: [],
        events: [],
        contacts: []
    };
    const [currTab, setCurrTab] = useState(0);
    const [data, setData] = useState(emptyApplication);
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [url, setUrl] = useState("");
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

    // Functions
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrTab(newValue);
    };

    useEffect(() => {
        // On mount

        // TODO: make api call to get job info
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
            events: [],
            contacts: []
        });
        setRole("Software Engineer");
        setCompany("Google");
        setUrl("google.com"); // maybe use clearbit api in more clever way?
    }, []);

    useEffect(() => {
        // On tab change
        const chooseComponent = () => {
            switch (currTab) {
                case 0:
                    return (
                        <JobDetails data={data}/>
                    );
                case 1:
                    return <div>Events</div>;
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

    
    return (
        <>
            <Box sx={{ display: 'flex', mt: 3, mb: 1 }}>
                <Box component="img" 
                    sx={{ mx: 5, height: imgSize, width: imgSize,
                         borderRadius: '50%' }} 
                    src={`${BASE_CLEARBIT_URL}${url}`} alt={company} />
                <div className="job-page-typography">
                    <Typography variant="h1" id="role"
                        sx={{ fontSize: h1Size }}
                        color="#190446">{role}</Typography>
                    <Typography variant="h2" id="company"
                        sx={{ fontSize: h2Size }}
                        color="#ADA7BD">{company}</Typography>
                </div>
            </Box>
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
                    <Tab icon={<Description style={{ fontSize: iconSize }} />}
                        iconPosition="start" 
                        label={notes}
                        sx={{ mx: tab_spacing }} />
                </Tabs>
            </Box>
            <Box sx={{ width: '75%', mx: 'auto', mt: 2 }}>
                {component}
            </Box>
        </>
    );
};