import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HandshakeIcon from '@mui/icons-material/Handshake';
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import ForumIcon from "@mui/icons-material/Forum";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGetAllCycles, useSignOut } from "api";
import Loading from "components/Loading";

import { FormGroup, Modal, TextField, Typography, useMediaQuery} from '@mui/material';
import { useGetCurrentCycle, useCreateApplication } from "api";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Add } from '@mui/icons-material';

const drawerWidth = 240;
const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

const SideDrawer = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [open, setOpen] = useState<boolean>(false);
    const [ddOpen, setDdOpen] = useState<boolean>(false);

    const { isLoading:isLoadingSignOut, refetch:signOut } = useSignOut();
    const { data:allCycles, isLoading:isLoadingAllCycles , refetch:getAllCycles } = useGetAllCycles();

    // modal stuff
    const [, setChanged] = useState(false);
    const [, setBuilt] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [addJobCompany, setAddJobCompany] = useState('');
    const [addJobPosition, setAddJobPosition] = useState('');
    const [addJobLocation, setAddJobLocation] = useState('');
    const [addJobJobPostUrl, setAddJobJobPostUrl] = useState('');
    const [addJobDescription, setAddJobDescription] = useState('');
    const today = new Date();
    const [addApplyDate, setAddApplyDate] = useState(today as Date);
    let date_picker: JSX.Element | null = null;
    const {refetch: fetchCurrentCycle} = useGetCurrentCycle();
    const { refetch: fetchCreateApplication} = useCreateApplication(addJobCompany, addJobPosition, addJobLocation, addJobJobPostUrl, addJobDescription, addApplyDate);
    const mobile: boolean = useMediaQuery('(max-width: 900px)');


    const handleClick = () => setDdOpen(!ddOpen);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleSignOut = () => {
        (async () => {
            try {
                await signOut({throwOnError: true});
                navigate('/');
            } catch (e) {}
        })();
    };


    useEffect(() => {
        (async () => {
            try {
                await getAllCycles({ throwOnError: true });
            } catch(e) {}
        })();
    }, [getAllCycles]);

    useEffect(() => {
        // Fetch data on mount
        setBuilt(false);
        const fetchData = async () => {
            try{
                await fetchCurrentCycle({ throwOnError: true });
            } catch(e) {

            }
        };
        fetchData();
    }, [fetchCurrentCycle]);

    const handleAddJob = async() => {
        try{
            await fetchCreateApplication({ throwOnError: true });
            await fetchCurrentCycle({ throwOnError: true });
        } catch(e) {

        }
        setChanged(true);
        setOpenModal(false);
        
        setAddJobCompany('');
        setAddJobPosition('');
        setAddJobLocation('');
        setAddJobJobPostUrl('');
        setAddJobDescription('');

        setChanged(false);
    };

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
                            value={addApplyDate}
                            onChange={(value: Date | null, _key) => 
                                value ? setAddApplyDate(value) : null}
                            renderInput={(params) => <TextField {...params} />}
                        /> :
                        <DesktopDatePicker
                            label="Date"
                            inputFormat="MM/dd/yyyy"
                            value={addApplyDate}
                            onChange={(value: Date | null, _key) => 
                                value ? setAddApplyDate(value) : null}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    }
                </Box>
            </LocalizationProvider>
        );  
    }

    date_picker = buildDatePicker(mobile);

    return (
        <Box sx={{ display: "flex", ml: 2 }}>
            <Loading open={isLoadingSignOut || isLoadingAllCycles} />
            <Box sx={{ width: 30, height: 30, margin: 2 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: "none" }) }}
                ><MenuIcon /></IconButton>
            </Box>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton aria-label="Close Drawer" onClick={handleDrawerClose}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <Box textAlign="center">
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ width: "90%" }}
                            onClick={() => setOpenModal(true)}
                        >Add Job Application</Button>
                    </Box>
                    <Modal open={openModal} onClose={() => setOpenModal(false)}
                        aria-labelledby="Add job form" >
                        <FormGroup sx={{ position: 'absolute', top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '50%', bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        padding: 1}}>
                            <Typography variant="h4">
                                Job Details
                            </Typography>
                            <TextField required id="job-company" variant="outlined"
                                label="Company" size="small" value={addJobCompany}
                                margin='normal'
                                onChange={(e) => setAddJobCompany(e.target.value)} />
                            <TextField required id="job-position" variant="outlined"
                                label="Position" size="small" value={addJobPosition}
                                margin='normal'
                                onChange={(e) => setAddJobPosition(e.target.value)} />
                            <TextField required id="job-location" variant="outlined"
                                label="Location" size="small" value={addJobLocation}
                                margin='normal'
                                onChange={(e) => setAddJobLocation(e.target.value)} />
                            <TextField required id="job-jobposturl" variant="outlined"
                                label="Job Post Url" size="small" value={addJobJobPostUrl}
                                margin='normal'
                                onChange={(e) => setAddJobJobPostUrl(e.target.value)} />
                            <TextField required id="job-description" variant="outlined"
                                label="Description" size="small" value={addJobDescription}
                                margin='normal'
                                onChange={(e) => setAddJobDescription(e.target.value)} />
                            {date_picker && date_picker}
                            <Button variant="contained" color="primary"
                                startIcon={<Add />}
                                sx={{ mt: 2, width: '50%', mx: 'auto' }}
                                onClick={handleAddJob}
                            >
                                Submit
                            </Button>
                        </FormGroup>
                    </Modal>
                    <ListItem
                        button
                        key="Home"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem
                        button
                        key="Metrics"
                        onClick={() => navigate("/metrics")}
                    >
                        <ListItemIcon><BarChartIcon /></ListItemIcon>
                        <ListItemText primary="Metrics" />
                    </ListItem>
                    <ListItem
                        button
                        key="Offers"
                        onClick={() => navigate("/offers")}
                    >
                        <ListItemIcon><HandshakeIcon /></ListItemIcon>
                        <ListItemText primary="Offers" />
                    </ListItem>
                    <ListItem
                        button
                        key="Forum"
                        onClick={() => navigate("/forum")}
                    >
                        <ListItemIcon><ForumIcon /></ListItemIcon>
                        <ListItemText primary="Forum" />
                    </ListItem>
                    <ListItem button key="Archives" onClick={handleClick}>
                        <ListItemIcon><InventoryIcon /></ListItemIcon>
                        <ListItemText primary="Archives" />
                        {ddOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={ddOpen} timeout="auto" unmountOnExit>
                        {allCycles?.slice().reverse().slice(1).map(cycle => {
                            return (
                                <List key={cycle._id} component="div" disablePadding>
                                    <ListItemButton
                                        sx={{ pl: 4 }} 
                                        onClick={() => navigate(`/metrics/${cycle._id}`)}>
                                        <ListItemText primary={(new Date(cycle.startDate)).toISOString().slice(0,10)} />
                                    </ListItemButton>
                                </List>
                            );
                        })}
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => navigate("/create")}
                            >
                                <ListItemText primary="Create New Cycle" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
                <Box
                    sx={{
                        width: "auto",
                        height: 40,
                        mt: "auto",
                        ml: "75%",
                    }}
                >
                    <IconButton
                        aria-label="signout"
                        onClick={handleSignOut}
                    ><LogoutIcon /></IconButton>
                </Box>
            </Drawer>
        </Box>
    );
};

export default SideDrawer;
