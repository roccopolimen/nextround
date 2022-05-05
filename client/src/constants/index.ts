import { createTheme } from "@mui/material";

const theme = createTheme({
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