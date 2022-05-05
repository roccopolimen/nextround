import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, CardHeader, CardContent, Button, Modal } from "@mui/material";
import { ForumPostObject } from 'typings';
import { useGetUser } from 'api';
import StatCard from 'components/StatCard';

const UserPost = (props: {post: ForumPostObject}) => {
    const [ post, setPost ] = useState(props.post);
    const [ userName, setUserName ] = useState('');

    const { data: userData, isLoading: isLoadingUser, refetch: refetchUser } = useGetUser(post['poster']);

    useEffect(() => {
        async function getUser() {
            try {
                await refetchUser({throwOnError: true});
            } catch(e) {
                setUserName('');
            }
        }
        getUser();
    }, [refetchUser, setUserName]);

    useEffect(() => {
        if(userData) {
            setUserName(userData['name']);
        }
    }, [userData, isLoadingUser]);

    const getDateString: Function = (post: ForumPostObject) => {
        if(post && post.postDate) {
            let tempDate: Date = new Date(post.postDate);
            return ((tempDate.getMonth()+1)+'-'+tempDate.getDate()+'-'+tempDate.getFullYear());
        } else {
            return "";
        }
    };

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let cardWidth: number = mobile ? 275: 550;

    return (
        <Grid sx={{mt: 2, mr: 'auto', ml: 'auto'}}>
            <Card sx={{width: cardWidth}}>
                <CardHeader title={userName} subheader={getDateString(post)}/>
                <CardContent sx={{ml: 'auto', mr: 'auto'}}>
                    <Typography sx={{mb: 3}} variant='body1'>
                        {post['content'] ? post['content']: ''}
                    </Typography>
                    <StatCard data={post['metrics']}/>
                </CardContent>
            </Card>
        </Grid>
    );
};


export default UserPost;