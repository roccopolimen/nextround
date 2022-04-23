import { Box, Button, Checkbox, Chip, FormControlLabel,
     FormGroup, 
     Typography,
     useMediaQuery} from "@mui/material";
import { Save } from '@mui/icons-material';
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { ApplicationObject, EventObject } from "typings";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot,
     TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";

export default function Events(props:
   { data: ApplicationObject | undefined,
        update: Dispatch<SetStateAction<ApplicationObject | undefined>> }) {
   // State variables
   const [data, setData] = useState(
       undefined as ApplicationObject | undefined);
   const [changed, setChanged] = useState(false);
   const today = new Date();

   // Responsive design
   const se: boolean = useMediaQuery('(max-width: 525px)');
   const mobile: boolean = useMediaQuery('(max-width: 900px)');
   let timeline_title_size: string = se ? "5rem" : (mobile ? "15rem" : "100%");
   let font_size: string = se ? "1.5rem" : (mobile ? "1.5rem" : "2rem");
   
   
   useEffect(() => {
       // On mount and data change
       if (props.data && !changed) {
           setData(props.data);
       }
   }, [data, props.data, changed]);

   /**
    * Mark events as complete/incomplete
    * @param event event info
    * @param checked whether the box is now checked
    */
   const handleToggle = (event: React.ChangeEvent<HTMLInputElement>,
                            checked: boolean) => {
         // On checkbox change
        if (data) {
            let newData: ApplicationObject = {
                ...data,
                events: data.events.map((ev: EventObject) => {
                    if (ev._id === event.target.id) {
                        return {
                            ...ev,
                            status: checked
                        };
                    }
                    return ev;
                })
            };
            setData(newData);
            setChanged(true);
        }
        };

   /**
    * Saves locally typed information
    */
   const handleSave = () => {
       if (data) {
           // TODO: api call to save data
           props.update(data);
           setChanged(false);
       }
   }

   if(!data) {
       return <div>Loading...</div>;
   } else {
       return (
        <Box>
            <FormGroup>
                {data.events && data.events.map((event) => {
                    return (
                        <Box key={event._id}>
                            <FormControlLabel
                                label={
                                    <Typography sx={{ fontSize: '12pt' }}>
                                        {event.title}
                                    </Typography>
                                }
                                sx={{ width: "50%", mb: 2,
                                    fontSize: font_size }}
                                control={<Checkbox key={event._id}
                                    id={event._id}
                                    checked={event.status} color="primary"
                                    onChange={handleToggle}  />} />
                            <Chip label={event.date.toLocaleDateString()}
                                    sx={{ml: 5}}
                                    size="small" color={event.status ?
                                         "success" : (event.date < today ?
                                         "error" : "info")} />
                        </Box>
                        );
                })}
            </FormGroup>

            <Timeline position="left">
                {data.events && data.events.map((event, index) => {
                    let connect: string = (index < data.events.length - 1 &&
                        data.events[index].status &&
                        data.events[index + 1].status) ? "#6e51ef" : "#bdbdbd";
                    return (
                        <TimelineItem key={event._id}>
                            <TimelineOppositeContent>
                                <Typography variant="body2"
                                    color="textSecondary">
                                    {event.date.toLocaleDateString()}
                                </Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="primary"
                                    variant={event.status ? "filled" :
                                                             "outlined"} />
                                {index < data.events.length - 1 && 
                                    <TimelineConnector 
                                        sx={{ backgroundColor: connect }} />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="body1"
                                    sx={{ maxWidth: timeline_title_size,
                                            overflow: 'auto' }}>
                                    {event.title}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>

            {changed ?
                <Button variant="contained" color="primary"
                startIcon={<Save />} onClick={() => handleSave()}
                sx={{ position: 'fixed',
                    bottom: (theme) => theme.spacing(2),
                    right: (theme) => theme.spacing(2) }} >
                Save</Button> : <div></div>
            }
        </Box>
     );
   }
}