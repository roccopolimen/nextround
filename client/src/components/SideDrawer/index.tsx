import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import ForumIcon from "@mui/icons-material/Forum";
import InventoryIcon from "@mui/icons-material/Inventory";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import { useSignOut } from "api";

// const cycleData = require('../../../../server/data/cycles');

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SideDrawer = (props: any) => {
  // props is the user id
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [ddOpen, setDdOpen] = React.useState(false);
  // const [itemsData, setItemsData] = React.useState(undefined as CycleObject | undefined);
  const {isLoading: isLoadingData, refetch: refetchLogout} = useSignOut();

  const navigate = useNavigate();

  const handleClick = () => {
    setDdOpen(!ddOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    (async () => {
      try {
        await refetchLogout({throwOnError: true});
        navigate('/')
      } catch (e) {
        console.log("Failed to logout");
      }
    })();
  };

  // TODO create listitems for each archived cycle
  // useEffect(() => {
  //   console.log('get cycles useEffect fired');
  //   async function fetchData() {
  //     try {
  //       const allCycle = await cycleData.getAllCycles(props.match.params.id);
  //       setItemsData(allCycle);
  //     } catch (e) {
  //       console.log("An error occurred");
  //     }
  //   }
  //   fetchData();
  // }, [props.match.params.id]);

  // const buildList = (item: any) => {
  //   return (
  //     <List component="div" disablePadding>
  //       {/* TODO change href to each cycle respective metric ie metrics/:cycleId */}
  //       <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/metrics/:cycleid', { replace: true })}>
  //         <ListItemText primary={item.startDate} />
  //       </ListItemButton>
  //     </List>
  //   )
  // }

  // let list = itemsData && itemsData.map((item: any) => {return buildList(item)})

  return (
    <Box sx={{ display: "flex", ml: 2 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          margin: 2,
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
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
              onClick={() => navigate("create")}
            >
              Add Job Application
            </Button>
          </Box>
          <ListItem
            button
            key="Home"
            // TODO navigate to application/:id for the most recent cycle
            onClick={() => navigate("/")}
          >
            <ListItemIcon>
              
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            key="Metrics"
            onClick={() => navigate("metrics")}
          >
            <ListItemIcon>
              
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Metrics" />
          </ListItem>
          <ListItem
            button
            key="Forum"
            onClick={() => navigate("forum")}
          >
            <ListItemIcon>
              
              <ForumIcon />
            </ListItemIcon>
            <ListItemText primary="Forum" />
          </ListItem>
          <ListItem button key="Archives" onClick={handleClick}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Archives" />
            {ddOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={ddOpen} timeout="auto" unmountOnExit>
            {/* {list} */}
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Archive test" />
              </ListItemButton>
            </List>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate("/")}
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
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideDrawer;
