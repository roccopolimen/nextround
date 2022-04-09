import { 
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

const Loading = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Typography variant="h5" component='h1'>Loading...{'    '}</Typography>
            <CircularProgress />
        </Box>
    );
};

export default Loading;