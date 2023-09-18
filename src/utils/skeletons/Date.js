import { Skeleton } from "@mui/material";
import React from "react";

const Date = () => {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      sx={{ width: "70px", minWidth: "70px" }}
      height={102}
    />
  );
};

export default Date;
