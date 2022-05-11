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
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import ForumIcon from "@mui/icons-material/Forum";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGetAllCycles, useSignOut } from "api";
import Loading from "components/Loading";


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
                    <IconButton onClick={handleDrawerClose}>
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
                            onClick={() => navigate("/create")}
                        >Add Job Application</Button>
                    </Box>
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
                            console.log(cycle);
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
