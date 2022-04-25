import { Box, Typography, useMediaQuery } from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';


export default function FirstCycle () {

    //Responsive Design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');
    let iconSize: number = mobile ? 50 : 100;
    let h1Size: string = mobile ? "1.75rem": "2.5rem";
    let bodySize: string = mobile ? "1rem": "1.5rem";
    let imagePad: number = mobile ? 7 : 15

    return (
        <>
            <Box sx={{ display: 'flex', mt: 7, mb: 1, ml: 7 }}>
                <div>
                    <Typography sx={{ fontWeight: 'bold', fontSize: h1Size }} component="h1" variant="h4">Welcome to Next Round!</Typography>
                    <Typography sx={{ display: 'flex', fontSize: bodySize, mt: 2}} variant="h2">Landing the job of your dreams is just a click away...</Typography>
                </div>
            </Box>
            {/* TODO: Add onclick start cycle functionality */}
            <AddCircleOutlineOutlinedIcon sx={{ color: 'blue', display: 'flex', fontSize: iconSize, margin: 'auto', mt: imagePad}}/>
        </>
    );
};