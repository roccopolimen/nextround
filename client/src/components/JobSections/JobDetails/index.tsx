import { Grid, InputAdornment, TextField } from "@mui/material";
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
    
    useEffect(() => {
        if (props.data) {
            setData(props.data);
            setCompany(props.data.company);
            setPosition(props.data.position);
            setUrl(props.data.jobPostUrl);
            setLocation(props.data.location);
            setSalary(props.data.salary);
            setCardColor(props.data.cardColor);
        }
    }, [data, props.data]);

    const handleColorChange = (color: Color) => {
        setCardColor('#' + color.hex);
    };

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
                {/* TODO: Make color picker larger and add label */}
                <Grid item xs={2} sm={4} md={4}>
                    {cardColor ? <ColorPicker value={cardColor}
                                    hideTextfield
                                    onChange={handleColorChange} /> :
                             <div></div>}
                </Grid>
                {/* TODO: Add description and progress picker */}
            </Grid>
      );
    }
}