import './style.css';
import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, Avatar, CardHeader, CardContent, CardActions, Button, Modal } from "@mui/material";
import { ApplicationObject, CycleObject} from "typings";
import { useGetCurrentCycle, useFinishCycles, useCreatePost } from "api";
import SideDrawer from 'components/SideDrawer';
import { useNavigate } from 'react-router-dom';

export default function OfferDash () {
    //const { data: userCycle, status: getStatus, isLoading: isLoadingCycle, refetch: refetchCycle } = useGetCurrentCycle();
    const navigate = useNavigate();

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

    // const emptyApps: ApplicationObject[] = [];

    const [offerData, setOfferData] = useState(tempCycle["applications"]);
    const [acceptId, setAcceptId] = useState('');
    const [accept, setAccept] = useState(false);
    const [open, setOpen] = useState(false);
    const [finishCycle, setFinishCycle] = useState(false);
    const [makePost, setMakePost] = useState(false);
    const BASE_CLEARBIT_URL: string = 'https://logo.clearbit.com/';

    // useEffect(() => {
    //     // On mount
    //     (async () => {
    //         try {
    //             await refetchCycle({ throwOnError: true });
                
    //             let offerApplications: ApplicationObject[] = [];
    //             if(userCycle && userCycle["applications"]) {
    //                 let cycleApp: ApplicationObject;
    //                 for(cycleApp of userCycle["applications"]) {
    //                     if(cycleApp["progress"] === 1) {
    //                         offerApplications.push(cycleApp);
    //                     }
    //                 }
    //             }
                
    //             setOfferData(offerApplications);
    //         } catch(e) {
    //             let emptyApplications: ApplicationObject[] = [];
    //             setOfferData(emptyApplications);
    //         }
    //     })();
    // }, []);

    useEffect(() => {
        if(finishCycle) {
            if(makePost) {
                // useCreatePost();
                console.log("Make Post");
                // navigate('/forum');
            }
            // useFinishCycles();
            console.log("Finish Cycle");
            // navigate('/create');
        }
    });

    const acceptOffer: Function = (offer: ApplicationObject) => {
        setAcceptId(offer["_id"]);
        setAccept(true);
        setOpen(true);
    };

    const postOffer: Function = (offer: ApplicationObject) => {
        console.log("Offer posted");
        setMakePost(true);
        setFinishCycle(true);
    };

    const noPostOffer: Function = () => {
        console.log("Offer not posted");
        setFinishCycle(true);
    };

    const makeButton: Function = (offer: ApplicationObject, accept: boolean ) => {
        if(!accept) {
            return (
                <Button onClick={() => { acceptOffer(offer) }} sx={{marginLeft: 'auto'}} variant="contained" color="success">
                    Accept
                </Button>);
        } else {
            return (<Button disabled sx={{marginLeft: 'auto'}} variant="contained">Accept</Button>);
        }
    };

    const closeModal: Function = () => {
        setOpen(false);
        setAcceptId('');
        setAccept(false);
    };

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let cardWidth: number = mobile ? 225: 275;


    return (
        <>  
            <SideDrawer />
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: 7, mt: 7 }} component="h1" variant="h4">
                Offer Dashboard
            </Typography>
            <Modal open={open} onClose={() => closeModal()}
                aria-labelledby="Add event form" >
                    <Card sx={{mr: 'auto', ml: 'auto', mt: 5, width: cardWidth }}>
                        <CardContent>
                            <Typography>
                                Would you like to make a post?
                            </Typography>
                            <br />
                            <Button onClick={() => postOffer()} sx={{marginLeft: 'auto', marginRight: 2, mt: 1}} variant="contained">
                                Post
                            </Button>
                            <Button onClick={() => noPostOffer()} sx={{marginLeft: 'auto', marginRight: 2, mt: 1}} variant="contained">
                                Don't Post
                            </Button>
                        </CardContent>
                    </Card>
            </Modal>
            <Grid container sx={{ display: 'flex', ml: 7, mt: 7 }}>
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