import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#6c50ed',
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