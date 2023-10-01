import {
  Autocomplete,
  CircularProgress,
  ListItem,
  ListItemText,
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import callApi from "../../api";
import {
  createGroup,
  deleteGroup,
  fetchGroupDetails,
  getGroupData,
  updateGroup,
} from "../../redux/slices/groupSlice";
import { APIS, DEBOUNCE_DELAY } from "../../utils/constants";
import Storage from "../../utils/localStore";
import ListAvatar from "../ListAvatar";
import ErrorAlert from "../snackbars/ErrorAlert";
import ErrorButton from "../wrappers/ErrorButton";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";
const { USER } = APIS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateGroup(props) {
  const { open, onClose, mode, groupId, isAdmin } = props;
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertText, setAlertText] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const initialValues = { title: "", members: [] };
  const [formValues, setFormValues] = useState(initialValues);
  const [searchValue, setSearchValue] = useState("");
  const isEditMode = mode === "edit";
  const userData = Storage.getJson("userData");
  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  let debounceTimer;

  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );

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

  useEffect(() => {
    setLoading(true);
    if (groupId) {
      dispatch(fetchGroupDetails({ id: groupId })).then((res) => {
        if (res && res.payload && Object.keys(res.payload).length) {
          let { title, members } = res.payload;
          if (title) {
            handleChange({ title });
          }
          if (members && members.length) {
            const fetchMemberInfo = async () => {
              const updatedMembers = await Promise.all(
                members.map(async (memberId) => {
                  const memberInfo = await API_fetchUsersById(memberId); // Replace with your API call
                  return memberInfo;
                })
              );
              handleChange({ members: updatedMembers });
            };

            fetchMemberInfo();
          }
        }
      });
    }
    setLoading(false);
  }, [groupId]);

  const API_fetchUsersById = async (id) => {
    let url = USER;
    if (id) {
      url = `${USER}/${id}`;
      try {
        const { status, data } = await callApi(url);
        if (status) {
          let res = {
            _id: data.data._id,
            fullName: data.data.fullName,
            email: data.data.email,
          };
          return res;
        }
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  };
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

  const handleChange = (values) => {
    setFormValues((prev) => {
      return { ...prev, ...values };
    });
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
      if (isEditMode) {
        if (groupId) {
          payload["_id"] = groupId;
          dispatch(updateGroup({ payload })).then((res) => {
            if (res.payload.status) {
              onClose();
            }
          });
        } else {
          setErrorAlert(true);
          setAlertText("Please pass group id");
        }
      } else {
        dispatch(createGroup({ payload })).then((res) => {
          if (res.payload.status) {
            onClose();
          }
        });
      }
    } else {
      setErrorAlert(true);
      setAlertText(message);
    }
  };
  const handleDeleteGroup = () => {
    if (groupId) {
      dispatch(
        deleteGroup({ id: groupId, uid: activeGroupData["createdBy"] })
      ).then((res) => {
        if (res.payload.status) {
          onClose();
        }
      });
    } else {
      setErrorAlert(true);
      setAlertText("Please pass group id");
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
        <DialogTitle>{`${isEditMode ? "Edit" : "Create"} group`}</DialogTitle>
        <DialogContent dividers={true} sx={{ pb: 4 }}>
          <Typography variant="subtitle2">Title</Typography>
          <OutlinedInput
            fullWidth
            placeholder="Enter group title"
            value={formValues.title}
            onChange={(e) => handleChange({ title: e.target.value })}
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
              handleChange({ members: val });
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option) => (
              <ListItem {...props} key={option._id}>
                <ListAvatar letter={option.fullName[0]} />
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
          {isEditMode && isAdmin && (
            <ErrorButton
              variant="contained"
              color="error"
              onClick={handleDeleteGroup}
            >
              Delete
            </ErrorButton>
          )}
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton variant="contained" onClick={submit}>
            {isEditMode ? "Update" : "Create"}
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
