import './styles.css'
import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export default function Settings() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO PATCH/PUT
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          <br/>
          {/* TODO change with user pfp */}
          <div className="pfp">
          <img src={require('../../images/logo.svg').default} alt="logo" width="128" height="128"/>
          <Fab className="FAB" color="primary" aria-label="edit" size="small">
            <EditIcon />
          </Fab>
          </div>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* TODO change default value based on user */}
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            variant="outlined"
            defaultValue="NAME"
            // helperText="Name"
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            variant="outlined"
            defaultValue="EMAIL"
            // helperText="Email"
          />
          <TextField
            margin="normal"
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="password"
            variant="outlined"
            defaultValue="PASSWORD"
            // helperText="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{ // toggling
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                     </Button>
                   </InputAdornment>
                )
              }}
          />
          <Button 
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
