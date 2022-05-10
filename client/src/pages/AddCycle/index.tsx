import { Box, Typography, useMediaQuery, Fab } from "@mui/material";
import AddIcon from '@material-ui/icons/Add';
import SideDrawer from 'components/SideDrawer';
import { useCreateCycle } from "api";
import { useNavigate } from 'react-router-dom';

export default function FirstCycle () {

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let bodySize: string = mobile ? "1rem": "1.5rem";
    let imagePad: number = mobile ? 7 : 15;
    let margins: number = mobile ? 2 : 7;
    let fabSize: string = mobile ? "medium" : "large";
    const navigate = useNavigate();

    //Queries
    const { refetch:createCycle } = useCreateCycle();
    
    const addCycle: Function = async () => {
        try {
            await createCycle({ throwOnError: true });
            navigate('/dashboard');
        } catch(e) {}
    }

    return (
        <>
            <SideDrawer />
            <Box sx={{ display: 'flex', mt: 7, mb: 1, ml: margins, mr: margins }}>
                <div>
                    <Typography sx={{ fontWeight: 'bold', fontSize: h1Size }} component="h1" variant="h4">Welcome to NextRound!</Typography>
                    <Typography sx={{ display: 'flex', fontSize: bodySize, mt: 2}} variant="h2">Landing the job of your dreams is just a click away...</Typography>
                </div>
            </Box>
            <Fab onClick={() => {addCycle()}} sx={{size: fabSize, display: 'flex', mt: imagePad, mb: 1, ml: 'auto', mr: 'auto'}} aria-label="create">
                <AddIcon />
            </Fab>
        </>
    );
};