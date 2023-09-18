import { Snackbar } from "@mui/material";
import React from "react";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ErrorAlert(props) {
  return (
    <Snackbar
      open={props.open}
      onClose={props.onClose}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert variant="filled" onClose={props.onClose} severity="error">
        {props.text}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
