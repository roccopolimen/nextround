import './style.css';
import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, Avatar, CardHeader, CardContent, CardActions, Button } from "@mui/material";
import { ApplicationObject, CycleObject} from "typings";

export default function OfferDash () {
    //(props: {user: ObjectId}) {

    //Variable to populate cycle Info to match variables until api call is made
    const tempCycle: CycleObject = {
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
    const [acceptId, setAcceptId] = useState('');
    const [accept, setAccept] = useState(false);
    const BASE_CLEARBIT_URL: string = 'https://logo.clearbit.com/';

    useEffect(() => {
        // On mount
        const cycle: CycleObject = {
            _id: '624e956c4c06f2509b940b1d',
            startDate: new Date('September 22, 2021'),
            endDate: new Date('December 20, 2021'),
            applications: [
                {
                    _id: '1',
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
                    _id: '4',
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
                    _id: '2',
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
                    _id: '3',
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
                    _id: '5',
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

    const acceptOffer: Function = (offer: ApplicationObject) => {
        //TODO: end cycle and update application progress
        setAcceptId(offer["_id"]);
        setAccept(true);
        console.log(offer["_id"]);
    }

    const postOffer: Function = (offer: ApplicationObject) => {
        //TODO: send to make analytics and make post then redirect to posts
        console.log("Offer posted");
    }

    const makeButton: Function = (offer: ApplicationObject, accept: boolean ) => {
        if(!accept) {
            return (
                <Button onClick={() => { acceptOffer(offer) }} sx={{marginLeft: 'auto'}} variant="contained" color="success">
                    Accept
                </Button>);
        } else if(offer["_id"] === acceptId) {
            return (
            <Button onClick={() => { postOffer(offer) }} sx={{marginLeft: 'auto'}} variant="contained">
                Post
            </Button>);
        } else {
            return (<Button disabled sx={{marginLeft: 'auto'}} variant="contained">Accept</Button>);
        }
    }

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let cardWidth: number = mobile ? 225: 275;


    return (
        <>
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: 7, mt: 7 }} component="h1" variant="h4">
                Offer Dashboard
            </Typography>
            <Grid container sx={{ display: 'flex',  ml: 7, mr: 7, mt: 7 }}>
                {offerData.map(offer => {
                        return (
                            <Grid key={offer["_id"]}> 
                                <Card key={offer["_id"]} sx={{mr: 2, mb: 1, mt: 1, width: cardWidth }}>
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
                                    <CardActions>
                                       {makeButton(offer, accept)}
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    }
                )}
            </Grid>
        </>
    );
};