import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, CardHeader, CardContent, Button, Modal } from "@mui/material";
import { useGetForum } from 'api';
import { ForumPostObject } from 'typings';
import { useSearchParams } from 'react-router-dom';
import SideDrawer from 'components/SideDrawer';

export default function Forum() {
    let startPosts: ForumPostObject[] = [];

    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState(startPosts);
    // const [posterId, setPosterId] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [numPosts, setNumPosts] = useState(3);

    //Queries
    const { data: postData, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetForum(numPosts);

    useEffect(() => {
        async function fetchData() {
			try {
                let userNumPosts = await searchParams.get("num_posts");
                if(userNumPosts) {
                    setNumPosts(parseInt(userNumPosts));
                    console.log(numPosts);
                }
                setLoading(true);
                await refetchPosts({throwOnError: true});
                if(postData) {
                    setPosts(postData);
                }
                setLoading(false);
            } catch(e) {
                let emptyPosts: ForumPostObject[] = [];
                setPosts(emptyPosts);
                setLoading(false);
            }
		}
        if(refresh) {
            console.log("Refresh");
            fetchData();
            setRefresh(false);
        }
    }, [refresh,numPosts, postData, refetchPosts, searchParams]); 

    const getDateString: Function = (post: ForumPostObject) => {
        if(post && post.postDate) {
            let tempDate: Date = new Date(post.postDate);
            return (tempDate.getFullYear()+'-'+(tempDate.getMonth()+1)+'-'+tempDate.getDate());
        } else {
            return "";
        }
    };

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let cardWidth: number = mobile ? 275: 550;
    let leftMargins: number = mobile ? 3: 7;

    return (
        <>
            <SideDrawer />
            <Modal open={loading || isLoadingPosts} sx={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Box sx={{ top: '50%', padding: 2 }}>
                    <CircularProgress />
                </Box>
            </Modal>
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: leftMargins, mt: 7 }} component="h1" variant="h4">
                Forum
            </Typography>
            <Button onClick={() => {setRefresh(true)}} sx={{ml:leftMargins, mt: 2}} variant="contained">
                Refresh Posts
            </Button>
            <Grid container sx={{ display: 'flex',  ml: leftMargins, mr: 7, mt: 5, mb: 5 }}>
                {posts.map(post => {
                    return (
                        <Grid key={post['_id']} sx={{mt: 2, mr: 'auto', ml: 'auto'}}>
                            <Card sx={{width: cardWidth}}>
                                <CardHeader title={'Poster'} subheader={getDateString(post)}/>
                                <CardContent>
                                    <p>Metrics go here</p>
                                <Typography variant='body2' color='text.secondary'>
                                    {post.content ? post.content : ''}
                                </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
}