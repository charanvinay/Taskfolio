import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const Loader = (props) => {
  const { open, onClose } = props;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
