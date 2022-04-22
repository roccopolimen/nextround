import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import BarChartIcon from '@mui/icons-material/BarChart';
import ForumIcon from '@mui/icons-material/Forum';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';

// const cycleData = require('../../../../server/data/cycles');

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const SideDrawer = (props: any) => {
  // props is the user id
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [ddOpen, setDdOpen] = React.useState(false);
  const [itemsData, setItemsData] = React.useState(undefined);
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
  //       {/* TODO change href to each cycle */}
  //       <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('../', { replace: true })}>
  //         <ListItemText primary={item.startDate} />
  //       </ListItemButton>
  //     </List>
  //   )
  // }

  // let list = itemsData && itemsData.map((item: any) => {return buildList(item)})

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            NextRound
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* TODO change hrefs */}
          <Box textAlign='center'>
            <Button variant="contained" color="primary" style={{width: '90%'}} onClick={() => navigate('../', { replace: true })}>Add Job Cycle</Button> 
          </Box>
          <ListItem button key="Home" onClick={() => navigate('../', { replace: true })}>
            <ListItemIcon> <HomeIcon /> </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button key="Metrics" onClick={() => navigate('../', { replace: true })}>
              <ListItemIcon> <BarChartIcon /> </ListItemIcon>
              <ListItemText primary="Metrics" />
            </ListItem>
            <ListItem button key="Forum" onClick={() => navigate('../', { replace: true })}>
              <ListItemIcon> <ForumIcon /> </ListItemIcon>
              <ListItemText primary="Forum" />
            </ListItem>
            <ListItem button key="Settings" onClick={() => navigate('../', { replace: true })}>
              <ListItemIcon> <SettingsIcon /> </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button key="Archives" onClick={handleClick}>
              <ListItemIcon> <InventoryIcon /> </ListItemIcon>
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
                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('../', { replace: true })}>
                  <ListItemText primary="Create New Cycle" />
                </ListItemButton>
              </List>
            </Collapse>
        </List>
      </Drawer>
    </Box>
  );
}

export default SideDrawer;
