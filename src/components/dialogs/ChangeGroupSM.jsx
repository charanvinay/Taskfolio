import { LogoutOutlined, SearchOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
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
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupDetails,
  fetchGroups,
  getGroupData,
  removeMember,
  setActiveGroup,
} from "../../redux/slices/groupSlice";
import { COLORS } from "../../utils/constants";
import Storage from "../../utils/localStore";
import PrimaryButton from "../wrappers/PrimaryButton";

import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import { FaRegEdit } from "react-icons/fa";

import ListAvatar from "../ListAvatar";
import ListSecondaryAction from "../ListSecondaryAction";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChangeGroupSM(props) {
  const { open, onClose, setMode, setOpenCreateGroup, setOpenJoinGroup } =
    props;
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData");
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const groups = useSelector((state) => getGroupData(state, "groups"));

  const selectGroup = (id) => {
    dispatch(fetchGroupDetails({ id }));
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
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
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
            My Groups
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
                groups
                  .filter((gr) => gr.title.includes(searchValue))
                  .map((group, ind) => {
                    const { _id, title, members, createdBy } = group;
                    const selected = _id === activeGroupData["_id"];
                    return (
                      <ListItem
                        key={_id}
                        disablePadding
                        secondaryAction={
                          userData?.["_id"] === createdBy ? (
                            <ListSecondaryAction
                              tooltip="Edit"
                              onClick={() => {
                                dispatch(setActiveGroup(_id));
                                setOpenCreateGroup(true);
                                setMode("edit");
                                onClose();
                              }}
                              icon={<FaRegEdit size={18} />}
                            />
                          ) : (
                            <ListSecondaryAction
                              tooltip="Leave"
                              onClick={() => {
                                setLoading(true);
                                dispatch(
                                  removeMember({
                                    id: _id,
                                    uid: userData["_id"],
                                    leave: true,
                                  })
                                ).then(() => {
                                  dispatch(
                                    fetchGroups({ uid: userData?.["_id"] })
                                  ).then(() => {
                                    setLoading(false);
                                  });
                                });
                              }}
                              icon={<LogoutOutlined />}
                            />
                          )
                        }
                      >
                        <ListItemButton
                          onClick={() => selectGroup(_id)}
                          key={_id}
                          // selected={selected}
                          sx={{
                            padding: "5px 10px",
                            border:
                              selected && `1px solid ${COLORS["PRIMARY"]}`,
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
                      </ListItem>
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
          <PrimaryButton
            variant="contained"
            fullWidth
            sx={{ minWidth: 0 }}
            startIcon={<AddIcon />}
            onClick={() => {
              setMode("add");
              setOpenCreateGroup(true);
              onClose();
            }}
          >
            Create
          </PrimaryButton>
          <PrimaryButton
            variant="contained"
            fullWidth
            sx={{ minWidth: 0 }}
            startIcon={<LoginIcon />}
            onClick={() => {
              setOpenJoinGroup(true);
              onClose();
            }}
          >
            Join
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
