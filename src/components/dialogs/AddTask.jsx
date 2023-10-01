import {
  Autocomplete,
  Box,
  Chip,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupData, setActiveMember } from "../../redux/slices/groupSlice";
import {
  addTask,
  deleteTask,
  fetchFormNames,
  getTaskData,
  handleTask,
  updateTask,
} from "../../redux/slices/taskSlice";
import { getUserData } from "../../redux/slices/userSlice";
import { COLORS } from "../../utils/constants";
import Storage from "../../utils/localStore";
import ErrorAlert from "../snackbars/ErrorAlert";
import SuccessAlert from "../snackbars/SuccessAlert";
import ErrorButton from "../wrappers/ErrorButton";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddTask(props) {
  const { open, onClose, selectedTask } = props;
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData");
  const [alertText, setAlertText] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );

  const groups = useSelector((state) => getGroupData(state, "groups"));
  const formSchema = useSelector((state) => getTaskData(state, "formSchema"));
  const error = useSelector((state) => getTaskData(state, "error"));
  const message = useSelector((state) => getTaskData(state, "message"));
  const activeDate = useSelector((state) => getUserData(state, "activeDate"));

  useEffect(() => {
    if (message) {
      setAlertText(message);
      if (error) {
        setErrorAlert(true);
      } else {
        setSuccessAlert(true);
      }
    }
  }, [message, error]);

  useEffect(() => {
    if (selectedTask) {
      formSchema.map((field) => {
        let val = selectedTask[field.name];
        if (field.name === "groupId") {
          dispatch(fetchFormNames({ groupId: val }));
        }
        dispatch(handleTask({ name: field.name, value: val }));
      });
    }
  }, [selectedTask]);

  const getOptions = (name) => {
    if (name === "groupId") {
      return groups.map((option) => option.title);
    }
  };
  const getDropdownValue = (name, value) => {
    if (name === "groupId") {
      return groups.find((option) => option._id === value)?.title;
    }
    return value;
  };

  const validateFields = () => {
    const errors = [];
    formSchema.map((field) => {
      if (!field.value) {
        errors.push(field.label);
      }
    });
    return errors;
  };
  const submit = () => {
    let errors = validateFields();
    if (errors.length === 0) {
      let payload = {
        createdBy: userData["_id"],
        date: activeDate,
      };
      formSchema.map((field) => {
        payload[field.name] = field.value;
      });
      if (selectedTask) {
        payload["_id"] = selectedTask["_id"];
        dispatch(updateTask({ payload }));
      } else {
        dispatch(addTask({ payload }));
      }
      dispatch(setActiveMember(userData["_id"]));
      onClose({ openGroup: payload["groupId"] });
    } else {
      setErrorAlert(true);
      setAlertText(`${errors[0]} is required`);
    }
  };
  const handleDeleteTask = () => {
    if (selectedTask) {
      dispatch(deleteTask({ payload: selectedTask })).then((res) => {
        if (res.payload.status) {
          setSuccessAlert(true);
          onClose();
        }
      });
    } else {
      setErrorAlert(true);
      setAlertText("Please pass task id");
    }
  };
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        disableEscapeKeyDown
        scroll="paper"
        fullWidth={true}
        fullScreen={isTabletOrMobile}
        maxWidth={"md"}
        // onClose={onClose}
      >
        <DialogTitle>
          {selectedTask ? "Update the " : "Create a "} task on{" "}
          <b style={{ color: COLORS["PRIMARY"] }}>
            {moment(activeDate).format("DD-MM-YYYY")}
          </b>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Grid container spacing={3} rowSpacing={2}>
            {formSchema &&
              formSchema.map((field) => {
                let {
                  name,
                  label,
                  element,
                  options,
                  value,
                  multiline,
                  freeSolo,
                  placeholder,
                  colors,
                } = field;
                if (element === "input") {
                  return (
                    <Grid item xs={12} sm={12} md={12} lg={12} key={name}>
                      <Typography variant="subtitle2">{label}</Typography>
                      <OutlinedInput
                        name={name}
                        value={value || ""}
                        fullWidth={true}
                        multiline={multiline}
                        placeholder={placeholder}
                        minRows={4}
                        onChange={(e) =>
                          dispatch(handleTask({ name, value: e.target.value }))
                        }
                      />
                    </Grid>
                  );
                } else if (element === "dropdown") {
                  return (
                    <Grid item xs={12} sm={12} md={6} lg={6} key={name}>
                      <Typography variant="subtitle2">{label}</Typography>
                      <Autocomplete
                        key={name}
                        name={name}
                        value={getDropdownValue(name, value) || null}
                        freeSolo={freeSolo}
                        disabled={name === "groupId" && Boolean(selectedTask)}
                        options={getOptions(name, value) || options}
                        onChange={(e, inpVal) => {
                          let val = inpVal;
                          // console.log(val);
                          if (name === "groupId") {
                            val = groups.find((g) => g.title === inpVal)?._id;
                            dispatch(fetchFormNames({ groupId: val }));
                          }
                          dispatch(handleTask({ name, value: val }));
                        }}
                        onInputChange={(e, value) => {
                          if (freeSolo) {
                            dispatch(handleTask({ name, value }));
                          }
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder={placeholder} />
                        )}
                      />
                    </Grid>
                  );
                } else if (element === "radio") {
                  return (
                    <Grid item xs={12} sm={12} md={12} lg={12} key={name}>
                      <Typography variant="subtitle2">{label}</Typography>
                      <Box
                        sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                      >
                        {options.map((option) => {
                          let { id, label } = option;
                          return (
                            <Chip
                              key={id}
                              label={label}
                              clickable={false}
                              onClick={() =>
                                dispatch(handleTask({ name, value: id }))
                              }
                              variant={value === id ? "filled" : "outlined"}
                              sx={{
                                cursor: "pointer",
                                fontWeight: "500",
                                color: value === id && "white",
                                backgroundColor:
                                  value === id ? colors[id] : "transparent",
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Grid>
                  );
                }
              })}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {selectedTask && (
            <ErrorButton
              variant="contained"
              color="error"
              onClick={handleDeleteTask}
            >
              Delete
            </ErrorButton>
          )}
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton variant="contained" onClick={submit}>
            {selectedTask ? "Update" : "Save"}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      <SuccessAlert
        open={successAlert}
        text={alertText}
        onClose={() => setSuccessAlert(false)}
      />
      <ErrorAlert
        open={errorAlert}
        text={alertText}
        onClose={() => setErrorAlert(false)}
      />
    </>
  );
}
