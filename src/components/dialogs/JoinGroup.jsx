import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Skeleton,
  Typography,
  useMediaQuery
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import callApi from "../../api";
import { joinGroup } from "../../redux/slices/groupSlice";
import {
  APIS,
  COLORS,
  DEBOUNCE_DELAY
} from "../../utils/constants";
import Storage from "../../utils/localStore";
import ListAvatar from "../ListAvatar";
import PrimaryButton from "../wrappers/PrimaryButton";
import SecondaryButton from "../wrappers/SecondaryButton";
const { GROUP } = APIS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function JoinGroup(props) {
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const userData = Storage.getJson("userData");
  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  let debounceTimer;
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      API_fetchGroups(searchValue);
    }, DEBOUNCE_DELAY);
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [searchValue]);

  const API_fetchGroups = async (title) => {
    let url = GROUP;
    if (title) {
      url = `${GROUP}?title=${title}`;
    }
    setLoading(true);
    try {
      const { status, data } = await callApi(url);
      if (status) {
        let res = data.data.filter((d) => !d.members.includes(userData["_id"]));
        // console.log(res);
        setGroups([...res]);
      } else {
        setGroups([]);
      }
      setLoading(false);
    } catch (error) {
      setGroups([]);
      setLoading(false);
      console.log(error);
    }
  };

  const submit = () => {
    dispatch(joinGroup({ id: selectedGroup, uid: userData["_id"] }));
    onClose();
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
        <DialogTitle>Select a group</DialogTitle>
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
            Groups
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
              {groups && groups.length > 0 ? (
                groups.map((group, ind) => {
                  const { _id, title, members } = group;
                  const selected = _id === selectedGroup;
                  return (
                    <ListItemButton
                      onClick={() => setSelectedGroup(_id)}
                      key={_id}
                      // selected={selected}
                      sx={{
                        padding: "5px 10px",
                        border: selected && `1px solid ${COLORS["PRIMARY"]}`,
                        borderRadius: 2,
                      }}
                    >
                      <ListAvatar letter={title[0]} />
                      <ListItemText
                        primary={title}
                        secondary={`${members.length} members`}
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
                  <Typography variant="body2">No groups found</Typography>
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
            Join
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
