import { Grid } from "@mui/material";
import React from "react";
import LeftBanners from "./components/LeftBanners";
import Login from "./components/Login";

function Auth() {
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
      <Login />
    </Grid>
  );
}

export default Auth;
