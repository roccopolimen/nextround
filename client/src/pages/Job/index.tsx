import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { Info, Event, Contacts, Description } from '@mui/icons-material';

export default function Job() {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // State variables
    const [currTab, setCurrTab] = useState(0);
    const [role, setRole] = useState("Software Engineer");
    const [company, setCompany] = useState("Google");
    const [url, setUrl] = useState("google.com");

    // Responsive design
    const mobile = useMediaQuery('(max-width: 900px)');
    let details = mobile ? "" : "Details";
    let events = mobile ? "" : "Events";
    let contacts = mobile ? "" : "Contacts";
    let notes = mobile ? "" : "Notes";
    let tab_spacing = mobile ? 0 : 5;

    // Functions
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrTab(newValue);
    };

    useEffect(() => {
        // On mount

        // TODO: make api call to get job info
        setRole("Software Engineer");
        setCompany("Google");
        setUrl("google.com"); // maybe use clearbit api in more clever way?
    }, []);

    useEffect(() => {
        // On tab change

        // TODO: change component based on tab
    }, [currTab]);

    
    return (
        <>
            <Box sx={{ display: 'flex', mt: 3, mb: 1 }}>
                <Box component="img" 
                    sx={{ mx: 5, height: 75, width: 75, borderRadius: '50%' }} 
                    src={`${BASE_CLEARBIT_URL}${url}`} alt={company} />
                <div className="job-page-typography">
                    <Typography variant="h1" id="role"
                        sx={{ fontSize: '2.5rem' }}
                        color="#190446">{role}</Typography>
                    <Typography variant="h2" id="company"
                        sx={{ fontSize: '2rem' }}
                        color="#ADA7BD">{company}</Typography>
                </div>
            </Box>
            <Box sx={{ width: '75%', mx: 'auto',
                 borderBottom: '0.05rem solid #ADA7BD' }}>
                <Tabs value={currTab}
                    onChange={handleChange}
                    centered
                    aria-label="tab navigation">
                    <Tab icon={<Info />} iconPosition="start" 
                        label={details}
                        disableRipple
                        sx={{ mx: tab_spacing }} />
                    <Tab icon={<Event />} iconPosition="start" 
                        label={events}
                        sx={{ mx: tab_spacing }} />
                    <Tab icon={<Contacts />} iconPosition="start" 
                        label={contacts}
                        sx={{ mx: tab_spacing }} />
                    <Tab icon={<Description />} iconPosition="start" 
                        label={notes}
                        sx={{ mx: tab_spacing }} />
                </Tabs>
            </Box>
        </>
    );
};