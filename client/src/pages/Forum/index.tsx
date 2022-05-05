import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, CardHeader, CardContent, Button, Modal } from "@mui/material";
import { useGetForum } from 'api';
import { ForumPostObject } from 'typings';
import { useSearchParams } from 'react-router-dom';
import SideDrawer from 'components/SideDrawer';
import UserPost from 'components/UserPost';

export default function Forum() {
    let startPosts: ForumPostObject[] = [];

    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState(startPosts);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [numPosts, setNumPosts] = useState(3);

    //Queries
    const { data: postData, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetForum(numPosts);

    useEffect(() => {
        async function getNumPosts() {
            let userNumPosts = await searchParams.get("num_posts");
            if(userNumPosts) {
                setNumPosts(parseInt(userNumPosts));
            }
        }
        getNumPosts();
        
    }, [numPosts, setNumPosts, searchParams]);

    useEffect(() => {
        async function fetchData() {
			try {
                console.log("Get Posts");
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
            fetchData();
            setRefresh(false);
        }
    }, [refresh, postData, refetchPosts]); 

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
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
                    <UserPost post={post}/>
                })}
            </Grid>
        </>
    );
}