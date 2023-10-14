import { Box, Grid, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuthData, updateUser } from "../../redux/slices/authSlice";
import { COLORS, COPY_STYLES, TASKTYPES } from "../../utils/constants";
import Storage from "../../utils/localStore";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CopySettings = (props) => {
  const { open, onClose, onSubmit } = props;
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData");
  const returnStyle = (name) => {
    let styles = {
      dot: (
        <ul
          style={{
            marginLeft: "20px",
          }}
        >
          {[1, 2].map((i) => (
            <li key={i} style={{ marginBottom: "5px", fontSize: "14px" }}>
              Task {i}
            </li>
          ))}
        </ul>
      ),
      "dot-type": (
        <ul
          style={{
            marginLeft: "20px",
          }}
        >
          {[1, 2].map((i) => (
            <li key={i} style={{ marginBottom: "5px", fontSize: "14px" }}>
              {`[${TASKTYPES[i].label}]`} Task {i}
            </li>
          ))}
        </ul>
      ),
      type: (
        <div>
          {[1, 2].map((i) => (
            <p key={i} style={{ marginBottom: "5px", fontSize: "14px" }}>
              {`[${TASKTYPES[i].label}]`} Task {i}
            </p>
          ))}
        </div>
      ),
      none: (
        <div>
          {[1, 2].map((i) => (
            <p key={i} style={{ marginBottom: "5px", fontSize: "14px" }}>
              Task {i}
            </p>
          ))}
        </div>
      ),
    };
    return styles[name];
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Choose your copying style</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {COPY_STYLES.map((style) => {
            let { id, name, label } = style;
            let isActive =
              (userData["copyStyle"] || COPY_STYLES[0].name) === name;
            return (
              <Grid item xs={12} sm={12} md={6} lg={6} key={id}>
                <Box
                  onClick={() => {
                    dispatch(
                      updateUser({
                        _id: userData["_id"],
                        copyStyle: name,
                      })
                    ).then(() => {
                      onClose();
                      onSubmit(name);
                    });
                  }}
                  sx={{
                    padding: "20px",
                    cursor: "pointer",
                    paddingTop: isActive ? "25px" : "20px",
                    border: `2px solid ${
                      isActive ? COLORS["PRIMARY"] : COLORS["BG"]
                    }`,
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "-55px",
                        fontSize: "12px",
                        textAlign: "center",
                        color: "white",
                        padding: "2px 0",
                        transform: "rotate(35deg)",
                        width: "60%",
                        backgroundColor: COLORS["PRIMARY"],
                      }}
                    >
                      Active
                    </span>
                  )}
                  {returnStyle(name)}
                  <Typography
                    variant="overline"
                    sx={{
                      width: "100%",
                      display: "flex",
                      lineHeight: 0,
                      mt: 3,
                      justifyContent: "center",
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CopySettings;
