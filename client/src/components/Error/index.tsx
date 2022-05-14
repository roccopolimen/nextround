import { Box, Typography, Button, Grid, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = (): JSX.Element => {
    const navigate = useNavigate();

    // responsive
    const mobile: boolean = useMediaQuery("(max-width: 600px)");
    const tablet: boolean = useMediaQuery("(max-width: 1200px)");
    const desktop: boolean = useMediaQuery("(min-width: 1201px");
    const width: string = mobile ? "100%" : tablet ? "65%" : "85%";
    const height: string = mobile ? "100%" : tablet ? "65%" : "100%";
    const ml: number = desktop ? 20 : 0;

    return (
        <>
        <Box ml={ml} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: "10vh",
            ml: 3,
            mr: 3
        }}>
            <Grid
                container
                item
                sm={12}
                lg={9}
                alignItems="center"
                className="justify-center"
                spacing={3}
            >
                {/* left */}
                <Grid item sm={12} lg={6} className="justify-center">
                    <img 
                        src={require('../../images/error.png')}
                        alt="graphic" width={width} height={height} />
                </Grid>
                {/* right */}
                <Grid item sm={12} lg={6}>
                    <Typography variant="h1">Oops, something went wrong...</Typography>
                    <br/>
                    <Typography variant="body1">Uh oh, something unexpected happens 
                                                and we can't find/load the page you're looking for. 
                                                Try going back to the previous page
                    </Typography>
                    <br/>
                    <Button variant="contained" sx={{boarderRadius: 8}} onClick={() => navigate(-1)}>Go Back</Button>
                </Grid>
            </Grid>
        </Box>
        </>
    );
};

export default Error;