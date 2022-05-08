import { Box,
        Button,
        Checkbox,
        Chip,
        FormControlLabel,
        FormGroup, 
        IconButton, 
        Modal, 
        TextField, 
        Typography,
        useMediaQuery
    } from "@mui/material";
import { Save, Add, Delete } from '@mui/icons-material';
import { useState, useEffect } from "react";
import { ApplicationObject, EventObject } from "typings";
import { Timeline,
         TimelineConnector,
         TimelineContent,
         TimelineDot,
         TimelineItem,
         TimelineOppositeContent,
         TimelineSeparator
        } from "@mui/lab";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Loading from 'components/Loading';

export default function Events(props: {
        data: ApplicationObject | undefined,
        update: (id: string, status: boolean) => void,
        addEvent: (title: string, date: string,
             location: string) => void,
        deleteEvent: (eventId: string) => void
    }
) {
   // State variables
   const [data, setData] = useState(
       undefined as ApplicationObject | undefined);
   const [changed, setChanged] = useState(false);
   const [open, setOpen] = useState(false);
   const today = new Date();
   const [title, setTitle] = useState('');
   const [location, setLocation] = useState('');
   const [selectedDate, setSelectedDate] = useState(today as Date | null);
   const [changedIds, setChangedIds] = useState(() => new Set() as Set<string>);

   // Responsive design
   const se: boolean = useMediaQuery('(max-width: 525px)');
   const mobile: boolean = useMediaQuery('(max-width: 900px)');
   let timeline_title_size: string = se ? "5rem" : (mobile ? "15rem" : "100%");
   let font_size: string = se ? "1.5rem" : (mobile ? "1.5rem" : "2rem");
   let date_picker: JSX.Element | undefined = undefined;
   
   
   useEffect(() => {
       // On mount and data change
       if (props.data && !changed) {
           setData(props.data);
       }
   }, [data, props.data, changed]);

   /**
    * Create a proper date picker given the device type
    * @param {boolean} mobile if the device is mobile
    * @returns {JSX.Element | undefined} date picker
    */
   const buildDatePicker = (mobile: boolean): JSX.Element => {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box m={2}>
                    {mobile ?
                        <MobileDatePicker
                            label="Date"
                            inputFormat="MM/dd/yyyy"
                            value={selectedDate}
                            onChange={(value: Date | null,
                                _key) => setSelectedDate(value)}
                            renderInput={(params) => <TextField {...params} />}
                        /> :
                        <DesktopDatePicker
                            label="Date"
                            inputFormat="MM/dd/yyyy"
                            value={selectedDate}
                            onChange={(value: Date | null,
                                _key) => setSelectedDate(value)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    }
                </Box>
            </LocalizationProvider>
        );  
   }

   date_picker = buildDatePicker(mobile);

   /**
    * Mark events as complete/incomplete
    * @param {React.ChangeEvent<HTMLInputElement>} event event info
    * @param {boolean} checked whether the box is now checked
    */
   const handleToggle = (event: React.ChangeEvent<HTMLInputElement>,
                            checked: boolean) => {
         // On checkbox change
        if(changedIds.has(event.target.id)) {
            setChangedIds(prev => {
                const next = new Set(prev);
                next.delete(event.target.id);
                if(next.size === 0) setChanged(false);
                return next;
            });
        } else {
            setChangedIds(prev => new Set(prev).add(event.target.id));
            setChanged(true);
        }
        if (data) {
            let newData: ApplicationObject = {
                ...data,
                events: data.events.map((ev: EventObject) => {
                    if (ev._id.toString() === event.target.id) {
                        return {
                            ...ev,
                            status: checked
                        };
                    }
                    return ev;
                })
            };
            setData(newData);
        }
        };

    /**
     * Adds an event with info from the form
     */
   const handleAddEvent = () => {
        if(title === "" || location === "") return;
        if (data && selectedDate) {
            props.addEvent(title, selectedDate.toLocaleDateString(), location);
            setChanged(true);
            setOpen(false);
            setTitle('');
            setSelectedDate(today);
            setLocation('');
            setChanged(false);
        }
    };

    /**
     * Delete an event
     * @param {string} id id of the event to delete
     */
    const deleteEvent = (id: string) =>  {
        if (data) {
            props.deleteEvent(id);
            setChanged(true);
            setChanged(false);
        }
    };

   /**
    * Saves locally typed information
    */
   const handleSave = () => {
       if (data) {
           // TODO: api call to save data
           changedIds.forEach(id => {
                let status: boolean | undefined = data.events.find(ev =>
                    ev._id === id)?.status;
                if(status !== undefined)
                    props.update(id, status);
           });
           setChanged(false);
       }
   }

   if(!data) {
    return (
        <div>
            <Loading open={ true } />
        </div>
    );
   } else {
       return (
        <Box>
            {/* Add event button */}
            <Box sx={{ display: "flex" }}>
                <Box sx={{ justifyContent: "flex-end",
                            alignItems: "flex-end"}}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={() => setOpen(true)}
                    >
                        Add Event
                    </Button>
                </Box>
            </Box>

            {/* Modal of the form displayed to add an event */}
            <Modal open={open} onClose={() => setOpen(false)}
                aria-labelledby="Add event form" >
                <FormGroup sx={{ position: 'absolute', top: '50%', left: '50%',
                                 transform: 'translate(-50%, -50%)',
                                 width: '50%', bgcolor: 'background.paper',
                                 boxShadow: 24,
                                 padding: 1}}>
                    <Typography variant="h4"
                                sx={{ width: '50%', mx: 'auto' }}>
                        Event Details
                    </Typography>
                    <TextField required id="event-title" variant="outlined"
                        label="Event Title" size="small" value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    {date_picker && date_picker}
                    <TextField required id="location-value" variant="outlined"
                        label="Location" size="small" value={location}
                        onChange={(e) => setLocation(e.target.value)} />
                    <Button variant="contained" color="primary"
                        startIcon={<Add />}
                        sx={{ mt: 2, width: '50%', mx: 'auto' }}
                        onClick={handleAddEvent}
                    >
                        Submit
                    </Button>
                </FormGroup>
            </Modal>

            {/* List of events */}
            <FormGroup sx={{ mt: 5 }}>
                {data.events && data.events.sort(
                        (a, b) => (new Date(a.date).getTime() - 
                                    new Date(b.date).getTime())
                    ).map((event) => {
                    let tmp_date: Date = typeof event.date === 'string' ?
                     new Date(event.date) : event.date;
                    return (
                        <Box key={event._id.toString()}>
                            {/* Checkbox with event title */}
                            <FormControlLabel
                                label={
                                    <Typography sx={{ fontSize: '12pt' }}>
                                        {event.title}
                                    </Typography>
                                }
                                sx={{ width: "50%", mb: 2,
                                    fontSize: font_size }}
                                control={<Checkbox key={event._id.toString()}
                                    id={event._id.toString()}
                                    checked={event.status} color="primary"
                                    onChange={handleToggle}  />} />
                            
                            {/* Date information pill */}
                            <Chip label={tmp_date.toLocaleDateString()}
                                    sx={{ml: 1}}
                                    size="small" color={event.status ?
                                         "success" : (tmp_date < today ?
                                         "error" : "info")} />
                            
                            {/* Delete button */}
                            {event.title !== "Apply" ?
                                <IconButton aria-label="delete" onClick={() => 
                                        deleteEvent(event._id.toString())} >
                                    <Delete />
                                </IconButton> : <div></div>}
                        </Box>
                        );
                })}
            </FormGroup>

            {/* Timeline */}
            <Timeline position="left">
                {data.events && data.events.sort(
                        (a, b) => (new Date(a.date).getTime() - 
                                    new Date(b.date).getTime())
                    ).map((event, index) => {
                    let connect: string = (index < data.events.length - 1 &&
                        data.events[index].status &&
                        data.events[index + 1].status) ? "#6e51ef" : "#bdbdbd";
                    return (
                        <TimelineItem key={event._id.toString()}>
                            <TimelineOppositeContent>
                                <Typography variant="body2"
                                    color="textSecondary">
                                    {typeof event.date === 'string' ? 
                                        new Date(
                                            event.date).toLocaleDateString() :
                                        event.date.toLocaleDateString()}
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

            {/* Save button */}
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