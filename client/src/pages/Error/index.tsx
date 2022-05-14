import { Box, Typography } from "@mui/material";

const Error = (): JSX.Element => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography>Something went wrong...</Typography>
        </Box>
    );
};

export default Error;