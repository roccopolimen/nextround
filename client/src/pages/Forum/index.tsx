// import './style.css';
import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, Avatar, CardHeader, CardContent, CardActions, Button } from "@mui/material";
import { ApplicationObject, CycleObject} from "typings";
import { useGetForum } from 'api';
import { ForumPostObject } from 'typings';
import SideDrawer from 'components/SideDrawer';

export default function Forum() {
    let startPosts: ForumPostObject[] = [];
    // const { data: postData, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetForum(10);
    
    let tempPost: ForumPostObject[] = [{
        _id: '624e7432b9bd8ffe79422272',
        poster: '624e7432b9bd8ffe79422272',
        jobCycle: '624e7432b9bd8ffe79422272',
        postDate: new Date('December 19, 2021'),
        content: "Wow what a wild ride this cycle has been!",
        metrics: {
            // Job Funnel
            num_saved: 3,
            num_applications: 3,
            num_interviewed: 3,
            num_offers: 2,
            // Other metrics
            num_rejections: 5,
            num_rounds: 5,
            avg_salary: 30000,
            num_connections: 6,
            application_timeline: [new Date('2021-09-22'), new Date('2021-09-24'), new Date('2021-10-05')]
        }
    }];

    const [posts, setPosts] = useState(tempPost);
    const [posterData, setPosterData] = useState('Brian')
    // console.log(useGetForum(10));
    // setPosts(tempPost);
    // useEffect(() => {
    //     // setPosts(tempPost);
    //     console.log(posts);
    //     // setPosts(posts);
    // });

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let cardWidth: number = mobile ? 225: 275;

    return (
        <>
            <SideDrawer />
            <Typography sx={{ fontWeight: 'bold', fontSize: h1Size, ml: 7, mt: 7 }} component="h1" variant="h4">
                Forum
            </Typography>
            <Grid container sx={{ display: 'flex',  ml: 7, mr: 7, mt: 7 }}>
                {posts.map(post => {
                    return (
                        <Grid key={post['_id']} sx={{mr: 'auto', ml: 'auto'}}>
                            <Card sx={{width: 500}}>
                                <CardHeader title={posterData} subheader={post.postDate.getFullYear()+'-'+(post.postDate.getMonth()+1)+'-'+post.postDate.getDate()}/>
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