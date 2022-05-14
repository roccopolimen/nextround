import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ApplicationObject } from "typings";
import Loading from 'components/Loading';

interface PropType {
    data: ApplicationObject | undefined,
    addNote: (content: string) => void
};

const MyNotes = (props: PropType): JSX.Element => {

    // State variables
    const [data, setData] = useState<ApplicationObject | undefined>(undefined);
    const [changed, setChanged] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');

    useEffect(() => {
        // On mount and data change
        if (props.data && !changed) {
            setData(props.data);
        }
    }, [data, props.data, changed]);
    

    if(!data) return <Loading open={true} />;
    return (
        <Box>
            {/* Text area for adding a new note */}
            <TextField multiline value={note} minRows={5}
                sx={{ width: '75%', margin: 'auto' }}
                inputProps={{
                    "aria-label": "Add a note",
                }}
                placeholder="Add a new note..."
                onChange={(e) => setNote(e.target.value)} />
            <Button sx={{ ml: 2 }} onClick={() => {
                if (note) {
                    props.addNote(note);
                    setChanged(true);
                    setNote('');
                    setChanged(false);
                }
            }}>Add Note</Button>

            {/* List of note cards */}
            <Grid container spacing={{ xs: 2, md: 3 }} 
                columns={{ xs: 4, sm: 8, md: 12 }}
                sx={{ mx: 5 }}>
                {data.notes.map((note, index) => (
                    <Grid item key={"note: " + index} sx={{ mt: 2 }}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="body1">
                                    {note}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MyNotes;