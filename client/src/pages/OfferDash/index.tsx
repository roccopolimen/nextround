import './style.css';
import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, Avatar, CardHeader, CardContent } from "@mui/material";
import { ApplicationObject, CycleObject} from "typings";

export default function OfferDash () {
    //(props: {user: ObjectId}) {

    //Variable to populate cycle Info to match variables until api call is made
    const tempCycle = {
        _id: '624e956c4c06f2509b940b1d',
        startDate: new Date('September 22, 2021'),
        endDate: new Date('December 20, 2021'),
        applications: [
            {
                _id: '624e1b08284261a838b3b96a',
                company: 'Google',
                position: 'Software Engineer',
                location: 'Mountain View, CA, USA',
                salary: 200000,
                cardColor: '#4285F4',
                progress: 1,
                jobPostUrl: 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/',
                description: `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`,
                notes: [],
                events: [],
                contacts: []
            }
        ]
    };

    const [offerData, setOfferData] = useState(tempCycle["applications"]);

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";

    const BASE_CLEARBIT_URL = 'https://logo.clearbit.com/';

    useEffect(() => {
        // On mount
        const cycle = {
            _id: '624e956c4c06f2509b940b1d',
            startDate: new Date('September 22, 2021'),
            endDate: new Date('December 20, 2021'),
            applications: [
                {
                    _id: '624e1b08284261a838b3b96a',
                    company: 'Google',
                    position: 'Software Engineer',
                    location: 'Mountain View, CA, USA',
                    salary: 200000,
                    cardColor: '#4285F4',
                    progress: 1,
                    jobPostUrl: 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/',
                    description: `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`,
                    notes: [],
                    events: [],
                    contacts: []
                },
                {
                    _id: '624e1b08284261a838b3b96a',
                    company: 'Amazon',
                    position: 'Front End Developer',
                    location: 'Seattle, WA, USA',
                    salary: 50000,
                    cardColor: '#4285F4',
                    progress: 1,
                    jobPostUrl: 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/',
                    description: `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`,
                    notes: [],
                    events: [],
                    contacts: []
                },
                {
                    _id: '624e1b08284261a838b3b96a',
                    company: 'Dropbox',
                    position: 'Backend Developer',
                    location: 'Stroudsburg, PA, USA',
                    salary: 300000,
                    cardColor: '#4285F4',
                    progress: 1,
                    jobPostUrl: 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/',
                    description: `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`,
                    notes: [],
                    events: [],
                    contacts: []
                },
                {
                    _id: '624e1b08284261a838b3b96a',
                    company: 'Some Random Company',
                    position: 'Software Engineer',
                    location: 'Company, TX, USA',
                    salary: 2000000,
                    cardColor: '#4285F4',
                    progress: 1,
                    jobPostUrl: 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/',
                    description: `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`,
                    notes: [],
                    events: [],
                    contacts: []
                },
                {
                    _id: '624e1b08284261a838b3b96a',
                    company: 'Cvent',
                    position: 'Software Engineer',
                    location: 'Fordham, NC, USA',
                    salary: 1000,
                    cardColor: '#4285F4',
                    progress: 1,
                    jobPostUrl: 'https://careers.google.com/jobs/results/128310308272775878-software-engineer-iii/',
                    description: `Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google's needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.`,
                    notes: [],
                    events: [],
                    contacts: []
                }
            ]
        };

        // TODO: Make api call to get application info
        setOfferData(cycle["applications"]);
    }, []);

    return (
        <>
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: 7, mt: 7 }} component="h1" variant="h4">
                Offer Dashboard:
            </Typography>
            <Grid container sx={{ display: 'flex',  ml: 7, mt: 7 }}>
                {offerData.map(offer => {
                        return (
                            <Grid sx={{ display: 'flex'}}> 
                                <Card sx={{display: 'felx', mr: 2, mb: 1, width: 275 }}>
                                    <CardContent>
                                        <CardHeader
                                                avatar={
                                                    <Avatar
                                                    alt={offer["company"]}
                                                    src={`${BASE_CLEARBIT_URL}${'google.com'}`}
                                                    />
                                                }
                                                titleTypographyProps={{variant: "h5"}}
                                                title={offer["company"]}
                                        />
                                        <Typography color="text.secondary"> 
                                            {offer["position"]}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary"> 
                                            {offer["location"]}
                                        </Typography>
                                        <Typography variant="body2">
                                            ${offer["salary"]}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    }
                )}
            </Grid>
        </>
    );
};