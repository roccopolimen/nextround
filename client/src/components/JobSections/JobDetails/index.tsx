import { Grid, InputAdornment, TextField, ToggleButton,
     ToggleButtonGroup } from "@mui/material";
import { ColorPicker, Color } from 'material-ui-color';
import { useState, useEffect } from "react";
import { ApplicationObject } from "typings";

export default function JobDetails(props:
    { data: ApplicationObject | undefined }) {
    // State variables
    const [data, setData] = useState(undefined as ApplicationObject |
                                                    undefined);
    const [company, setCompany] = useState(undefined as string | undefined);
    const [position, setPosition] = useState(undefined as string | undefined);
    const [url, setUrl] = useState(undefined as string | undefined);
    const [location, setLocation] = useState(undefined as string | undefined);
    const [salary, setSalary] = useState(undefined as number | undefined);
    const [cardColor, setCardColor] = useState(undefined as string | undefined);
    const [description, setDescription] = useState(undefined as
                                                     string | undefined);
    const [progress, setProgress] = useState(undefined as number | undefined);
    
    // TODO: Responsive design
    
    useEffect(() => {
        if (props.data) {
            setData(props.data);
            setCompany(props.data.company);
            setPosition(props.data.position);
            setUrl(props.data.jobPostUrl);
            setLocation(props.data.location);
            setSalary(props.data.salary);
            setCardColor(props.data.cardColor);
            setDescription(props.data.description);
            setProgress(props.data.progress);
        }
    }, [data, props.data]);

    const handleColorChange = (color: Color) => {
        setCardColor('#' + color.hex);
    };

    const handleProgressUpdate = (event: React.MouseEvent<HTMLElement>,
        value: number | null): void => {
        if (value !== null) {
            setProgress(value);
        }
    }

    if(!data) {
        return <div>Loading...</div>;
    } else {
        return (
            <Grid container spacing={{ xs: 2, md: 3 }} 
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{ mx: 5 }}>
                <Grid item xs={2} sm={4} md={4}>
                    {company ? <TextField id="company-value" variant="outlined"
                        label="Company" size="small"
                        defaultValue={company} /> : <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    {position ? <TextField id="position-value"
                        variant="outlined" label="Job Title" size="small"
                        defaultValue={position} /> : <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    {url ? <TextField id="url-value" variant="outlined"
                        label="Job Post URL" size="small"
                        defaultValue={url} /> : <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    {location ? <TextField id="location-value"
                        variant="outlined" label="Location" size="small"
                        defaultValue={location} /> : <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    {salary ? <TextField id="salary-value" variant="outlined"
                        label="Salary" size="small"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$
                                            </InputAdornment>
                          }}
                        defaultValue={salary} /> : <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    <label htmlFor="color-picker">Card Color</label>
                    {cardColor ? <ColorPicker value={cardColor}
                                    onChange={handleColorChange} /> :
                             <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    {description ? <TextField id="description-value"
                        variant="outlined" label="Description" size="small"
                        multiline
                        rows={5}
                        defaultValue={description} /> : <div></div>}
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    <ToggleButtonGroup
                        value={progress}
                        exclusive
                        color="primary"
                        onChange={handleProgressUpdate}
                        aria-label="Progress Picker" >
                        <ToggleButton value={0} aria-label="in progress"
                            fullWidth >
                            <p>In Progress</p>
                        </ToggleButton>
                        <ToggleButton value={1} aria-label="offer"
                            fullWidth >
                            <p>Offer</p>
                        </ToggleButton>
                        <ToggleButton value={2} aria-label="rejected"
                            fullWidth >
                            <p>Rejected</p>
                        </ToggleButton>
                        <ToggleButton value={3} aria-label="waitlisted"
                            fullWidth >
                            <p>Waitlisted</p>
                        </ToggleButton>
                        <ToggleButton value={4} aria-label="ghosted"
                            fullWidth >
                            <p>Ghosted</p>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>
      );
    }
}