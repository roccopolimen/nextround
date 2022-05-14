import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ApplicationObject } from "typings";
import Loading from 'components/Loading';

export default function MyNotes(props: {
    data: ApplicationObject | undefined,
    addNote: (content: string) => void }) {

    // State variables
    const [data, setData] = useState(undefined as
         ApplicationObject | undefined);
    const [changed, setChanged] = useState(false);
    const [note, setNote] = useState('');

    useEffect(() => {
        // On mount and data change
        if (props.data && !changed) {
            setData(props.data);
        }
    }, [data, props.data, changed]);
    

    if(!data) {
        return (
            <div>
                <Loading open={ true } />
            </div>
        );
    } else {
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
    }
}