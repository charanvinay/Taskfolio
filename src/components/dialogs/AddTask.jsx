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
import { getGroupData } from "../../redux/slices/groupSlice";
import {
  addTask,
  fetchFormNames,
  getTaskData,
  handleTask,
} from "../../redux/slices/taskSlice";
import { getUserData } from "../../redux/slices/userSlice";
import { COLORS, TASKTYPECOLORS } from "../../utils/constants";
import ErrorAlert from "../snackbars/ErrorAlert";
import SuccessAlert from "../snackbars/SuccessAlert";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";
import Storage from "../../utils/localStore"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddTask(props) {
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData")
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
      dispatch(addTask({ payload }));
      onClose({ openGroup: payload["groupId"] });
    } else {
      setErrorAlert(true);
      setAlertText(`${errors[0]} is required`);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        scroll="paper"
        fullWidth={true}
        fullScreen={isTabletOrMobile}
        maxWidth={"md"}
        onClose={onClose}
      >
        <DialogTitle>
          Create a task on{" "}
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
                        value={getDropdownValue(name)}
                        freeSolo={freeSolo}
                        options={getOptions(name, value) || options}
                        onChange={(e, inpVal) => {
                          let val = inpVal;
                          console.log(val);
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
                                  value === id
                                    ? TASKTYPECOLORS[id]
                                    : "transparent",
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
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton variant="contained" onClick={submit}>
            Save
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
