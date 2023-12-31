import {
  Autocomplete,
  Box,
  Chip,
  Grid,
  OutlinedInput,
  Stack,
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
  handleTaskByKey,
  handleTask,
  updateTask,
} from "../../redux/slices/taskSlice";
import { getUserData } from "../../redux/slices/userSlice";
import { APIS, COLORS, getTaskFormSchema } from "../../utils/constants";
import Storage from "../../utils/localStore";
import ErrorAlert from "../snackbars/ErrorAlert";
import SuccessAlert from "../snackbars/SuccessAlert";
import ErrorButton from "../wrappers/ErrorButton";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";
import callApi from "../../api";
const { MEMBERS } = APIS;
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
      formSchema.forEach((field) => {
        let val = selectedTask[field.name];
        if (field.name === "groupId") {
          dispatch(fetchFormNames({ groupId: val }));
        } else if (field.name === "assignedTo" && selectedTask["groupId"]) {
          fetchMembers(selectedTask["groupId"]);
        }
        dispatch(handleTask({ name: field.name, value: val }));
      });
    } else {
      formSchema.forEach((field) => {
        let schema = getTaskFormSchema();
        let isExisits = schema.find((e) => e.name === field.name);
        if (isExisits) {
          dispatch(handleTask({ name: field.name, value: isExisits["value"] }));
        }
      });
    }
  }, [selectedTask]);

  const getOptions = (name) => {
    if (name === "groupId") {
      return groups.map((option) => option.title);
    } else if (name === "assignedTo") {
      let options = [];
      formSchema.map((field) => {
        if (field.name === name && field.options && field.options.length) {
          options = field.options.map((m) => m.fullName);
        }
      });
      return options;
    }
  };
  const fetchMembers = async (id) => {
    try {
      const { status, data } = await callApi(`group/${id}/${MEMBERS}`);
      if (status) {
        dispatch(
          handleTaskByKey({
            name: "assignedTo",
            key: "options",
            value: data.data,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDropdownValue = (name, value) => {
    if (name === "groupId") {
      return groups.find((option) => option._id === value)?.title;
    } else if (name === "assignedTo") {
      let title = "";
      formSchema.map((field) => {
        if (field.name === name && field.options && field.options.length) {
          title = field.options.find((m) => m._id === value)?.fullName;
        }
      });
      return title;
    }
    return value;
  };

  const validateFields = () => {
    const errors = [];
    formSchema.forEach((field) => {
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
      formSchema.forEach((field) => {
        payload[field.name] = field.value;
      });
      dispatch(setActiveMember(payload["assignedTo"]));
      if (selectedTask) {
        payload["_id"] = selectedTask["_id"];
        dispatch(updateTask({ payload }));
      } else {
        dispatch(addTask({ payload }));
      }
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
                    <Grid item xs={12} sm={12} md={4} lg={4} key={name}>
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
                            dispatch(
                              handleTask({ name: "assignedTo", value: null })
                            );
                            fetchMembers(val);
                          } else if (name === "assignedTo") {
                            formSchema.map((field) => {
                              if (field.name === name) {
                                val = field.options.find(
                                  (m) => m.fullName === inpVal
                                )._id;
                              }
                            });
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
                return null;
              })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              flexDirection: isTabletOrMobile ? "column-reverse" : "row",
            }}
          >
            {selectedTask && (
              <ErrorButton
                variant="contained"
                color="error"
                onClick={handleDeleteTask}
                fullWidth={isTabletOrMobile}
              >
                Delete
              </ErrorButton>
            )}
            <SecondaryButton onClick={onClose} fullWidth={isTabletOrMobile}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              variant="contained"
              onClick={submit}
              fullWidth={isTabletOrMobile}
            >
              {selectedTask ? "Update" : "Save"}
            </PrimaryButton>
          </Stack>
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
