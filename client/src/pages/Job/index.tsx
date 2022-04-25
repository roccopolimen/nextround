import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { Info, Event, Contacts, Description } from '@mui/icons-material';

export default function Job() {
    // Constants
    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    // State variables
    const [currTab, setCurrTab] = useState(0);
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [url, setUrl] = useState("");

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
        </>
    );
};