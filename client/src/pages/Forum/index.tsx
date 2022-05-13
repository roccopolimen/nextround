import { useEffect, useState } from "react";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { Button } from "@mui/material";
import { useGetForum } from 'api';
import { ForumPostObject } from 'typings';
import { useSearchParams } from 'react-router-dom';
import { checkNonNegativeNumber } from 'helpers/errors'
import SideDrawer from 'components/SideDrawer';
import UserPost from 'components/UserPost';
import Loading from 'components/Loading';

export default function Forum() {
    let startPosts: ForumPostObject[] = [];

    const [searchParams] = useSearchParams();
    const [posts, setPosts] = useState(startPosts);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);
    const [numPosts, setNumPosts] = useState('5');

    //Queries
    const { data: postData, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetForum(parseInt(numPosts));

    useEffect(() => {
        async function fetchData() {
			try {
                setLoading(true);
                await refetchPosts({throwOnError: true});
                setLoading(false);
            } catch(e) {
                let emptyPosts: ForumPostObject[] = [];
                setPosts(emptyPosts);
                setLoading(false);
            }
		}
        fetchData();
        setRefresh(false);
    }, [refresh, postData, refetchPosts, numPosts]);

    useEffect(() => {
        async function getNumPosts() {
            let userNumPosts: string | null = await searchParams.get("num_posts");
            if(userNumPosts && checkNonNegativeNumber(parseInt(userNumPosts))) {
                setNumPosts(userNumPosts);
                setRefresh(true);
            }
        }
        getNumPosts();
        
    }, [numPosts, setNumPosts, searchParams]);

    useEffect(() => {
        if(postData) {
            setPosts(postData);
        }
    }, [postData, setPosts, numPosts]);

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let margins: number = mobile ? 3: 7;

    return (
        <>
            <SideDrawer />
            <Loading open={loading || isLoadingPosts} />
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: margins, mt: margins }} component="h1" variant="h4">
                Forum
            </Typography>
            <Button onClick={() => {setRefresh(true)}} sx={{ml: margins, mt: 2}} variant="contained">
                Refresh Posts
            </Button>
            <Stack sx={{ml: margins}}>
                {posts.map(post => {
                    return (<UserPost key={post['_id']} post={post}/>);
                })}
            </Stack>
        </>
    );
}