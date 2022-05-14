import { useState } from "react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Card, CardHeader, CardContent } from "@mui/material";
import { ForumPostObject } from 'typings';
import StatCard from 'components/StatCard';

interface PropType {
    post: ForumPostObject
};

const UserPost = (props: PropType): JSX.Element => {
    const [ post ] = useState<ForumPostObject>(props.post);

    const getDateString = (post: ForumPostObject): string => {
        if(post && post.postDate) {
            let tempDate: Date = new Date(post.postDate);
            return ((tempDate.getMonth()+1)+'-'+tempDate.getDate()+'-'+tempDate.getFullYear());
        }
        return "";
    };

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let cardWidth: number = mobile ? 275: 550;

    return (
        <Grid sx={{mt: 2, mr: 'auto', ml: 'auto'}}>
            <Card sx={{width: cardWidth}}>
                <CardHeader subheader={getDateString(post)}/>
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