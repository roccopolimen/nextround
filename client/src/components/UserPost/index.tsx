import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, CardHeader, CardContent, Button, Modal } from "@mui/material";
import { ForumPostObject } from 'typings';

const UserPost = (props: {post: ForumPostObject}) => {

    const [post, setPost] = useState(props.post);


    useEffect(() => {
        setPost(props.post);
    }, [props]);

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
    let cardWidth: number = mobile ? 275: 550;

    console.log('hit');
    return (
        <Grid key={post['_id']} sx={{mt: 2, mr: 'auto', ml: 'auto'}}>
            <Card sx={{width: cardWidth}}>
                <CardHeader subheader={getDateString(post)}/>
                <CardContent>
                    <Typography variant='body1'>
                        {post.content ? post.content : ''}
                    </Typography>
                    <p>Metrics go here</p>
                </CardContent>
            </Card>
        </Grid>
    );
};


export default UserPost;