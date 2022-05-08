import './styles.css'
import { ReactElement, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';

import { useChangeSettings, useGetUser } from "api";
import { useParams, useNavigate } from "react-router-dom";
import { UserObject } from "typings";

export default function Settings() {
  // state variables
  const [patchSettings, setPatchSettings] = useState(false);
  const [hasNewData, setHasNewData] = useState(false);

  // state variables for queries and mutation
  let params = useParams();
  let userId: string = params.id ? params.id : "";
  const [data, setData] = useState(undefined as UserObject | undefined);
  const [id, setId] = useState(data ? data._id : "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: api_data, isLoading, refetch: fetchSettings } = useGetUser(userId);
  const { refetch: updateSettings } = useChangeSettings(name, email);

  const navigate = useNavigate();

  // use effects
  useEffect(() => {
    //on mount, get data
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if(!isLoading && api_data) {
        setData(api_data);
    }
}, [isLoading, api_data]);

useEffect(() => {
  // On data update
  setId(data ? data._id : "");
  setName(data ? data.name : "");
  setEmail(data ? data.email : "");
  setHasNewData(true);
}, [data]);

  useEffect(() => {
    // make the patch call
    const callApi = async () => {
      await updateSettings();
      await fetchSettings();
    }
    if (patchSettings && hasNewData) {
      setPatchSettings(false);
      callApi();
    }
  }, [patchSettings, hasNewData, updateSettings, fetchSettings]);

  useEffect(() => {
    //props function
    const update = (data: UserObject) => {
      setHasNewData(false);
      setData(data);
      setPatchSettings(true);
    }
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("name") == '' || data.get("email") == '') return;
    (() => {
      try {
        useChangeSettings(JSON.stringify(data.get("name")),  JSON.stringify(data.get("email")));
        navigate('/settings')
      } catch (e) {
        console.log("Failed to update profile");
      }
    })();
  }

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
          <div className="pfp">
          <Avatar sx={{ m: 1, bgcolor: 'primary', width: 128, height: 128}}>
              <PermIdentityOutlinedIcon fontSize="large"/>
          </Avatar>
          {/* TODO if no pfp ? use below : load from db */}
         <Fab className="FAB" color="primary" aria-label="edit" size="small">
            <EditIcon />
          </Fab>
          </div>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            variant="outlined"
            defaultValue={name}
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
            defaultValue={email}
            // helperText="Email"
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
