import { SearchOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import callApi from "../../api";
import { fetchMembers, getGroupData, joinGroup } from "../../redux/slices/groupSlice";
import {
  APIS,
  COLORS,
  DARKCOLORS,
  DEBOUNCE_DELAY,
} from "../../utils/constants";
import Storage from "../../utils/localStore";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";
import ErrorAlert from "../snackbars/ErrorAlert";
const { USER } = APIS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMember(props) {
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertText, setAlertText] = useState("")
  const [errorAlert, setErrorAlert] = useState(false)
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const userData = Storage.getJson("userData");
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  let debounceTimer;
  useEffect(() => {
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
          (d) => !activeGroupData.members.includes(d["_id"])
        );
        // console.log(res);
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

  const submit = () => {
    if(selectedUser){
      dispatch(joinGroup({ id: activeGroupData["_id"], uid: selectedUser }));
      onClose();
    } else{
      setErrorAlert(true)
      setAlertText("Select a user to add")
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
        <DialogTitle>Select an user</DialogTitle>
        <DialogContent dividers={true}>
          <OutlinedInput
            fullWidth
            placeholder="Search by name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            }
          />
          <Typography
            variant="subtitle2"
            sx={{ color: COLORS["PRIMARY"], mt: 2 }}
          >
            Users
          </Typography>
          {loading ? (
            [1, 2].map((loader) => (
              <Skeleton
                animation="wave"
                height={40}
                variant="rectangular"
                sx={{ width: "100%", mb: 1 }}
                key={loader}
              />
            ))
          ) : (
            <List>
              {users && users.length > 0 ? (
                users.map((user) => {
                  const { _id, fullName, email } = user;
                  const selected = _id === selectedUser;
                  return (
                    <ListItemButton
                      onClick={() => setSelectedUser(_id)}
                      key={_id}
                      // selected={selected}
                      sx={{
                        padding: "5px 10px",
                        border: selected && `1px solid ${COLORS["PRIMARY"]}`,
                        borderRadius: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: DARKCOLORS[fullName[0].toLowerCase()],
                          }}
                        >
                          {fullName[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={fullName}
                        secondary={email}
                        primaryTypographyProps={{
                          fontWeight: selected && "500",
                          color: selected && COLORS["PRIMARY"],
                        }}
                        secondaryTypographyProps={{
                          fontSize: "12px !important",
                        }}
                      />
                    </ListItemButton>
                  );
                })
              ) : (
                <Box
                  sx={{
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2">No users found</Typography>
                </Box>
              )}
            </List>
          )}
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
            Add
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      <ErrorAlert
        open={errorAlert}
        text={alertText}
        onClose={() => setErrorAlert(false)}
      />
    </>
  );
}
