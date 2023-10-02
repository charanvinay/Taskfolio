import { Grid } from "@mui/material";
import React, { useState } from "react";
import LeftBanners from "./components/LeftBanners";
import Login from "./components/Login";
import Register from "./components/Register";
function Auth() {
  const [signUp, setSignUp] = useState(false);
  
  return (
    <Grid
      container
      sx={{
        height: "100dvh",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      <LeftBanners />
      {signUp ? (
        <Register setSignUp={setSignUp} />
      ) : (
        <Login setSignUp={setSignUp} />
      )}
    </Grid>
  );
}

export default Auth;
