import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import LeftBanners from "./components/LeftBanners";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import { useLocation } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";
function Auth() {
  const [authType, setAuthType] = useState("login");
  const handleAuthType = (e) => setAuthType(e);
  const location = useLocation();
  useEffect(() => {
    if(location.pathname.includes("/resetPassword")){
      setAuthType("reset-password");
    }
  }, [location.pathname])
  
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
      {authType === "register" && <Register authType={handleAuthType} />}
      {authType === "login" && <Login authType={handleAuthType} />}
      {authType === "forgot-password" && <ForgotPassword authType={handleAuthType} />}
      {authType === "reset-password" && <ResetPassword authType={handleAuthType} />}
    </Grid>
  );
}

export default Auth;
