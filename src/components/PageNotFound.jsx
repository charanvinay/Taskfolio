import { Box, Typography } from "@mui/material";
import React from "react";
import NoData from "../Assets/no_data_found.svg";
import { grey } from "@mui/material/colors";

const NotFound = ({text1, text2}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "50vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={NoData}
        style={{ width: "150px", height: "150px" }}
        alt="No data"
        loading="lazy"
      />
      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: grey[400] }}
      >
        {text1} {<br />}{text2}
      </Typography>
    </Box>
  );
};

export default NotFound;
