import { Box, Button, Card, CardActions, CardContent, FormGroup, Grid, IconButton, Modal, Stack, TextField, Typography } from "@mui/material";
import { Add, Delete, Email, LocalPhone } from '@mui/icons-material';
import { useEffect, useState } from "react";
import { ApplicationObject } from "typings";
import Loading from 'components/Loading';

export default function MyContacts(props: {
    data: ApplicationObject | undefined,
    addContact: (name: string, phone: string, email: string) => void,
    deleteContact: (id: string) => void }) {

    // State variables
    const [data, setData] = useState(undefined as
         ApplicationObject | undefined);
    const [changed, setChanged] = useState(false);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        // On mount and data change
        if (props.data) {
            setData(props.data);
        }
    }, [data, props.data, changed]);

    /**
     * Adds an event with info from the form
     */
    const handleAddContact = () => {
        if(name === "" || phone === "" || email === "") return;
        if (data) {
            props.addContact(name, phone, email);
            setChanged(true);
            setOpen(false);
            setName('');
            setPhone('');
            setEmail('');
            setChanged(false);
        }
    };

    /**
     * Deletes a contact
     * @param id The id of the contact to delete
     */
    const deleteContact = (id: string) => {
        if (data) {
            props.deleteContact(id);
            setChanged(true);
            setChanged(false);
        }
    };

    if(!data) {
        return (
            <div>
                <Loading open={ true } />
            </div>
        );
    } else {
        return (
            <Box>
                {/* Add Contact Button */}
                <Box sx={{ display: "flex", mb: 2 }}>
                    <Box sx={{ justifyContent: "flex-end",
                                alignItems: "flex-end"}}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => setOpen(true)}
                        >
                            Add Contact
                        </Button>
                    </Box>
                </Box>

                {/* Modal of the form displayed to add a contact */}
                <Modal open={open} onClose={() => setOpen(false)}
                    aria-labelledby="Add event form" >
                    <FormGroup sx={{ position: 'absolute', top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '50%', bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    padding: 1}}>
                        <Typography variant="h4"
                                    sx={{ width: '50%', mx: 'auto' }}>
                            Contact Info
                        </Typography>
                        <TextField required id="contact-name" variant="outlined"
                            label="Name" size="small" value={name} margin='normal'
                            onChange={(e) => setName(e.target.value)} />
                        <TextField required id="contact-phone"
                            variant="outlined" label="Phone #" size="small"
                            value={phone} margin='normal'
                            onChange={(e) => setPhone(e.target.value)} />
                        <TextField required id="contact-email"
                            variant="outlined" label="Email" size="small"
                            value={email} margin='normal'
                            onChange={(e) => setEmail(e.target.value)} />
                        <Button variant="contained" color="primary"
                            startIcon={<Add />}
                            sx={{ mt: 2, width: '50%', mx: 'auto' }}
                            onClick={handleAddContact}
                        >
                            Submit
                        </Button>
                    </FormGroup>
                </Modal>
                {/* List of contact cards */}
                <Grid container spacing={{ xs: 2, md: 3 }} 
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{ mx: 5 }}>
                        {data.contacts.map((contact, index) => (
                            <Grid item key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h3"
                                            sx={{fontSize: 20, lineHeight: 2}}>
                                            {contact.name}
                                        </Typography>
                                        <Stack direction="row"
                                            alignItems="center" gap={1}>
                                            <LocalPhone />
                                            <Typography variant="body1">
                                                {contact.phone}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row"
                                            alignItems="center" gap={1}>
                                            <Email />
                                            <Typography variant="body1">
                                                {contact.email}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton aria-label="delete"
                                            onClick={() => deleteContact(
                                                contact._id.toString())
                                            } >
                                            <Delete />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}    
                </Grid>
            </Box>
            );
        }
}