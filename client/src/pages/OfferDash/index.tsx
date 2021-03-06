import './style.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Avatar,
    Alert,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    FormGroup,
    Grid,
    Modal,
    TextField,
    Typography,
    useMediaQuery
} from "@mui/material";
import { ApplicationObject } from "typings";
import { useGetCurrentCycle, useFinishCycles, useCreatePost } from "api";
import Error from 'components/Error';
import SideDrawer from 'components/SideDrawer';
import Loading from 'components/Loading';
import { checkNonEmptyString } from 'helpers';

const OfferDash = (): JSX.Element => {
    const emptyApps: Array<ApplicationObject> = [];

    const [offerData, setOfferData] = useState<Array<ApplicationObject>>(emptyApps);
    const [accept, setAccept] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [postText, setPostText] = useState<string>('');
    const [error, setError ] = useState<boolean>(false);
    const [postError, setPostError ] = useState<boolean>(false);
    const navigate = useNavigate();

    //Queries
    const { data: userCycle, isLoading: isLoadingCycle, refetch: refetchCycle } = useGetCurrentCycle();
    const { refetch: refetchPost } = useCreatePost(postText);
    const { refetch: refetchFinishCycle } = useFinishCycles();

    useEffect(() => {
        (async () => { 
            try {
                await refetchCycle({ throwOnError: true });
                let offerApplications: Array<ApplicationObject> = [];
                if(userCycle && userCycle.applications)
                    for(let cycleApp of userCycle.applications)
                        if(cycleApp.progress === 1)
                            offerApplications.push(cycleApp);
                setOfferData(offerApplications);
            } catch(e) {
                navigate('/create');
            }
        })();
    }, [navigate, refetchCycle, userCycle]);

    const acceptOffer = () => {
        setAccept(true);
        setOpen(true);
    };

    const postOffer = async () => {
        if(!checkNonEmptyString(postText)) {
            setPostError(true);
        } else {
            setPostError(false);
            try {
                await refetchPost();
                await refetchFinishCycle(); 
                navigate('/forum');
            } catch(e) {
                setError(true);
            }
        }
    };

    const noPostOffer = async () => {
        try {
            await refetchFinishCycle();
            navigate('/create');
        } catch(e) {
            setError(true);
        }
    };

    const makeButton = (offer: ApplicationObject, accept: boolean ) => {
        if(!accept) {
            return (
                <Button onClick={() => { acceptOffer() }} sx={{marginLeft: 'auto'}} variant="contained" color="success">
                    Accept
                </Button>);
        } else {
            return (<Button disabled sx={{marginLeft: 'auto'}} variant="contained">Accept</Button>);
        }
    };

    const emptyOffers = (offerData: ApplicationObject[]) => {
        if(offerData && offerData.length === 0) {
            return (
                <Typography sx={{ml: 7, mt: 7, color:'grey'}}>
                    Your offers will appear here when you update your applications
                </Typography>
            );
        }
    };

    const closeModal = () => {
        setOpen(false);
        setAccept(false); 
    };

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let cardWidth: number = mobile ? 225: 275;
    let formWidth: number = mobile ? 175: 225;
    let margins: number = mobile ? 2 : 7;

    if(error) {
        return (
            <>
                <Loading open={isLoadingCycle} />
                <SideDrawer />
                <Error />
            </>
        );
    }

    return (
        <>  
            <Loading open={isLoadingCycle} />
            <SideDrawer />
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: margins, mt: margins }} component="h1" variant="h4">
                Offers Dashboard
            </Typography>
            <Modal open={open} onClose={() => closeModal()}
                aria-labelledby="Add event form" >
                    <Card sx={{mr: 'auto', ml: 'auto', mt: margins, width: cardWidth }}>
                        <CardContent>
                            <Typography>
                                Would you like to make a post about your cycle?
                            </Typography>
                            <br />
                            <FormGroup sx={{width: formWidth, bgcolor: 'background.paper',
                                 padding: 1}}>
                                <Typography sx={{mb: 1}}>
                                    Post Text:
                                </Typography>
                                <TextField id="post-text" variant="outlined"
                                    label="Comment" size="small" value={postText}
                                    onChange={(e) => setPostText(e.target.value)} />
                            </FormGroup>
                            <Button onClick={() => postOffer()} sx={{marginLeft: 'auto', marginRight: 2, mt: 1}} variant="contained">
                                Post
                            </Button>
                            <Button onClick={() => noPostOffer()} sx={{marginLeft: 'auto', marginRight: 2, mt: 1}} variant="contained">
                                Don't Post
                            </Button>
                            {postError && <Alert sx={{mt: 1}} severity="error">Please enter a message to post</Alert>}
                        </CardContent>
                    </Card>
            </Modal>
            {emptyOffers(offerData)}
            <Grid container sx={{ display: 'flex', ml: margins, mt: margins }}>
                {offerData.map(offer => {
                        return (
                            <Grid key={offer["_id"]}> 
                                <Card key={offer["_id"]} sx={{mr: 2, mb: 1, mt: 1, width: cardWidth }}>
                                    <CardContent>
                                        <CardHeader
                                                avatar={
                                                    <Avatar
                                                        alt={offer.company}
                                                        src={offer.companyLogo}
                                                        onError={({ currentTarget }: { currentTarget: any }) => {
                                                            currentTarget.onerror = null;
                                                            currentTarget.src = require('../../images/no-company-logo.png');
                                                        }}
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

export default OfferDash;