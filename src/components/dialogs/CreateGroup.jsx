import {
  Autocomplete,
  Avatar,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import callApi from "../../api";
import { createGroup } from "../../redux/slices/groupSlice";
import { APIS, DARKCOLORS, DEBOUNCE_DELAY } from "../../utils/constants";
import Storage from "../../utils/localStore";
import ErrorAlert from "../snackbars/ErrorAlert";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";
const { USER } = APIS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateGroup(props) {
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertText, setAlertText] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const initialValues = { title: "", members: [] };
  const [formValues, setFormValues] = useState(initialValues);
  const [searchValue, setSearchValue] = useState("");

  const userData = Storage.getJson("userData");
  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  let debounceTimer;

  useEffect(() => {
    setLoading(true);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      API_fetchUsers(searchValue);
    }, DEBOUNCE_DELAY);
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [searchValue]);

  const API_fetchUsers = async (name) => {
    let url = USER;
    if (name) {
      url = `${USER}?fullName=${name}`;
    }
    try {
      const { status, data } = await callApi(url);
      if (status) {
        let res = data.data.filter(
          (d) =>
            !formValues.members.includes(d["_id"]) &&
            d["_id"] !== userData["_id"]
        );
        setUsers([...res]);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      setUsers([]);
      setLoading(false);
      console.log(error);
    }
  };

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };
  const validation = () => {
    if (!formValues.title) {
      return { valid: false, message: "Please enter a valid title" };
    } else if (!formValues.members || formValues.members.length === 0) {
      return { valid: false, message: "Please select atleast one user" };
    }
    return { valid: true };
  };
  const submit = () => {
    let { valid, message } = validation();
    if (valid) {
      let payload = {
        createdBy: userData["_id"],
        title: formValues.title,
        members: [
          userData["_id"],
          ...formValues.members.map((member) => member._id),
        ],
      };
      dispatch(createGroup({ payload }));
      onClose();
    } else {
      setErrorAlert(true);
      setAlertText(message);
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
        // onClose={onClose}
      >
        <DialogTitle>Create a group</DialogTitle>
        <DialogContent dividers={true} sx={{ pb: 4 }}>
          <Typography variant="subtitle2">Title</Typography>
          <OutlinedInput
            fullWidth
            placeholder="Enter group title"
            value={formValues.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Members
          </Typography>
          <Autocomplete
            multiple
            options={users}
            loading={loading}
            getOptionLabel={(option) => option.fullName}
            filterSelectedOptions
            value={formValues.members}
            disableCloseOnSelect
            onChange={(e, val) => {
              handleChange("members", val);
            }}
            renderOption={(props, option) => (
              <ListItem {...props} key={option._id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: DARKCOLORS[option.fullName[0].toLowerCase()],
                    }}
                  >
                    {option.fullName[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={option.fullName}
                  secondary={option.email}
                />
              </ListItem>
            )}
            noOptionsText="No users found"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search users by name"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            )}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          <PrimaryButton variant="contained" onClick={submit}>
            Create
          </PrimaryButton>
        </DialogActions>
        <ErrorAlert
          open={errorAlert}
          text={alertText}
          onClose={() => setErrorAlert(false)}
        />
      </Dialog>
    </>
  );
}
