import { 
    Box,
    CircularProgress,
    Typography,
} from "@mui/material";

const Loading = () => {
    return (
        <Box
            sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
            }}
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