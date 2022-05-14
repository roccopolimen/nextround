import {
    Button,
    Grid,
    InputAdornment,
    TextField,
    ToggleButton,
    ToggleButtonGroup, 
    Typography
} from "@mui/material";
import { Save } from '@mui/icons-material';
import { ColorPicker, Color } from 'material-ui-color';
import { useState, useEffect } from "react";
import { ApplicationObject } from "typings";
import Loading from 'components/Loading';

interface PropType {
    data: ApplicationObject | undefined,
    update: (data: ApplicationObject) => void
};

const JobDetails = (props: PropType): JSX.Element => {
    // State variables
    const [data, setData] = useState<ApplicationObject | undefined>(undefined);
    const [changed, setChanged] = useState<boolean>(false);
    
    useEffect(() => {
        // On mount and data change
        if (props.data && !changed) {
            setData(props.data);
        }
    }, [data, props.data, changed]);

    /**
     * @description Changes the color of the job card
     * @param {Color} color new color
     */
    const handleColorChange = (color: Color) => {
        if(data) {
            setChanged(true);
            let new_data: ApplicationObject | undefined = { ...data };
            new_data.cardColor = '#' + color.hex;
            setData(new_data);
        }
    };

    /**
     * @description Changes the progress of the job
     * @param {React.MouseEvent<HTMLElement>} event click information
     * @param {number | null} value new progress value
     */
    const handleProgressUpdate = (_event: React.MouseEvent<HTMLElement>, value: number | null) => {
        if (value !== null && data) {
            setChanged(true);
            let new_data: ApplicationObject | undefined = { ...data };
            new_data.progress = value;
            setData(new_data);
        }
    };

    /**
     * Changes the corresponding field with the newly typed value
     * @param {React.ChangeEvent<HTMLInputElement>} event keybord input info
     */
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(data) {
            setChanged(true);
            let new_data: ApplicationObject | undefined = { ...data };
            switch(event.target.id) {
                case "company-value":
                    new_data.company = event.target.value;
                    break;
                case "position-value":
                    new_data.position = event.target.value;
                    break;
                case "location-value":
                    new_data.location = event.target.value;
                    break;
                case "salary-value":
                    let salary_input: number = parseInt(event.target.value);
                    if (event.target.value === "" ||
                        Number.isNaN(salary_input) || salary_input < 0) {
                        new_data.salary = 0;
                        data.salary = 0;
                    } else {
                        new_data.salary = salary_input;
                        data.salary = salary_input;
                    }
                    break;
                case "url-value":
                    new_data.jobPostUrl = event.target.value;
                    break;
                case "description-value":
                    new_data.description = event.target.value;
                    break;
                default:
                    break;
            }
            setData(new_data);
        }
    };

    /**
     * Saves locally typed information
     */
    const handleSave = () => {
        if (data) {
            props.update(data);
            setChanged(false);
        }
    };

    if(!data) return <Loading open={true} />;
    return (
        <Grid container spacing={{ xs: 2, md: 3 }} 
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ mx: 5 }}>
            <Grid item >
                {data.company || data.company === "" ?
                    <TextField id="company-value"
                    variant="outlined" label="Company" size="small"
                    onChange={handleTextChange}
                    value={data.company} /> : <div></div>
                }
            </Grid>
            <Grid item >
                {data.position || data.position === "" ?
                    <TextField id="position-value"
                    variant="outlined" label="Job Title" size="small"
                    onChange={handleTextChange}
                    value={data.position} /> : <div></div>
                }
            </Grid>
            <Grid item >
                {data.jobPostUrl || data.jobPostUrl === "" ?
                    <TextField id="url-value"
                    variant="outlined" label="Job Post URL" size="small"
                    onChange={handleTextChange}
                    value={data.jobPostUrl} /> : <div></div>
                }
            </Grid>
            <Grid item >
                {data.location || data.location === "" ?
                    <TextField id="location-value"
                    variant="outlined" label="Location" size="small"
                    onChange={handleTextChange}
                    value={data.location} /> : <div></div>
                }
            </Grid>
            <Grid item >
                {data.salary || data.salary === 0 ?
                    <TextField id="salary-value"
                    variant="outlined" label="Salary" size="small"
                    onChange={handleTextChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$
                                        </InputAdornment>
                        }}
                    value={data.salary} /> : <div></div>
                }
            </Grid>
            <Grid item >
                {data.description || data.description === "" ?
                    <TextField id="description-value"
                    variant="outlined" label="Description" size="small"
                    multiline
                    onChange={handleTextChange}
                    rows={5}
                    value={data.description} /> : <div></div>
                }
            </Grid>
            <Grid item >
                <ToggleButtonGroup
                    value={data.progress}
                    size="small"
                    exclusive
                    color="primary"
                    onChange={handleProgressUpdate}
                    aria-label="Progress Picker" >
                    <ToggleButton value={0} aria-label="in progress"
                        fullWidth size="small" >
                        <Typography variant="overline">
                            In Progress
                        </Typography>
                    </ToggleButton>
                    <ToggleButton value={1} aria-label="offer"
                        fullWidth size="small" >
                        <Typography variant="overline">
                            Offer
                        </Typography>
                    </ToggleButton>
                    <ToggleButton value={2} aria-label="rejected"
                        fullWidth size="small" >
                        <Typography variant="overline">
                            Rejected
                        </Typography>
                    </ToggleButton>
                    <ToggleButton value={3} aria-label="waitlisted"
                        fullWidth size="small" >
                        <Typography variant="overline">
                            Waitlisted
                        </Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid item >
                <label htmlFor="color-picker">Card Color</label>
                {data.cardColor ?
                    <ColorPicker value={data.cardColor} hideTextfield
                                onChange={handleColorChange} /> :
                            <div></div>
                }
            </Grid>

            {/* Save button */}
            {changed ?
                <Button variant="contained" color="primary"
                startIcon={<Save />} onClick={() => handleSave()}
                sx={{ position: 'fixed',
                    bottom: (theme) => theme.spacing(2),
                    right: (theme) => theme.spacing(2) }} >
                Save</Button> : <div></div>
            }
        </Grid>
    );
};

export default JobDetails;