import { createTheme, Theme } from "@mui/material";

const theme: Theme = createTheme({
    palette: {
        primary: {
            main: '#6c50ed',
        },
        background: {
            default: "#F9F8FF",
        }
    }, 
    typography: {
        fontFamily: [
          "Poppins",
          "Helvetica",
          "Arial",
          "sans-serif"
        ].join(","),
    }
});

export default theme;