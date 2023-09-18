import { Box, Grid, Hidden } from "@mui/material";
import React from "react";
import { COLORS } from "../../../utils/constants";

import login from "../../../Assets/login.png";
import logoblue from "../../../Assets/logobluesm.png";
import dotsb from "../../../Assets/dotsb.png";
import dotscross from "../../../Assets/dotscross.png";

const LeftBanners = () => {
  return (
    <Hidden smDown>
      <Grid
        item
        md={6}
        lg={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: "20px",
          overflow: "hidden",
          backgroundColor: COLORS["PRIMARY"],
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            position: "absolute",
            top: -25,
            right: -120,
            opacity: 0.5,
            filter: "invert(100%)",
          }}
        >
          <img src={dotscross} alt={"dotswhite"} width="400px" />
        </Box>
        <img src={login} alt={"login_image"} width="70%" />
        <Box
          sx={{
            overflow: "hidden",
            position: "absolute",
            bottom: -70,
            left: -10,
            opacity: 0.5,
            filter: "invert(100%)",
          }}
        >
          <img src={dotsb} alt={"dotswhite"} width="200px" />
        </Box>
      </Grid>
    </Hidden>
  );
};

export default LeftBanners;
