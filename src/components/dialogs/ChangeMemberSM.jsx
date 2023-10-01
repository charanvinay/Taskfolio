import {
  PersonRemoveOutlined,
  SearchOutlined
} from "@mui/icons-material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  getGroupData,
  removeMember,
  setActiveMember
} from "../../redux/slices/groupSlice";
import { COLORS } from "../../utils/constants";
import Storage from "../../utils/localStore";
import PrimaryButton from "../wrappers/PrimaryButton";
import ListAvatar from "../ListAvatar";
import ListSecondaryAction from "../ListSecondaryAction";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChangeMemberSM(props) {
  const { open, onClose, setAddMember } = props;
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData");
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isTabletOrMobile = useMediaQuery((theme) =>
    theme.breakpoints.down("sm")
  );
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const activeMember = useSelector((state) =>
    getGroupData(state, "activeMember")
  );
  const members = useSelector((state) => getGroupData(state, "members"));
  useEffect(() => {
    if (activeGroup) {
      // console.log(activeGroupData.members);
      setLoading(true);
      dispatch(fetchMembers({ id: activeGroup })).then(() => {
        setLoading(false);
      });
    }
  }, [activeGroup, activeGroupData.members]);
  const isAdmin = userData?.["_id"] === activeGroupData["createdBy"];

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
        <DialogTitle sx={{ color: COLORS["PRIMARY"], fontWeight: "bold" }}>
          {activeGroupData["title"]}
        </DialogTitle>
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
            Members ({members?.length || 0})
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
              {members && members.length > 0 ? (
                members.map((member, ind) => {
                  const { _id, fullName, email } = member;
                  const selected = _id === activeMember;
                  return (
                    <ListItem
                      key={email}
                      disablePadding
                      secondaryAction={
                        _id !== userData["_id"] && (
                          <ListSecondaryAction
                            tooltip="Remove"
                            onClick={() => {
                              setLoading(true);
                              dispatch(
                                removeMember({
                                  id: activeGroupData["_id"],
                                  uid: _id,
                                })
                              ).then(() => {
                                dispatch(
                                  fetchMembers({
                                    id: activeGroup,
                                  })
                                );
                                setLoading(false);
                              });
                            }}
                            icon={<PersonRemoveOutlined />}
                          />
                        )
                      }
                    >
                      <ListItemButton
                        onClick={() => {
                          dispatch(setActiveMember(_id));
                          onClose();
                        }}
                        key={email}
                        sx={{
                          padding: "5px 10px",
                          border: selected && `1px solid ${COLORS["PRIMARY"]}`,
                          borderRadius: 2,
                        }}
                      >
                        <ListAvatar letter={fullName[0]} />
                        <ListItemText
                          primary={fullName}
                          secondary={email}
                          sx={{
                            "& .MuiTypography-root": {
                              noWrap: true,
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            },
                          }}
                          primaryTypographyProps={{
                            fontWeight: selected && "500",
                            letterSpacing: 0,
                            color: selected && COLORS["PRIMARY"],
                            textTransform: "capitalize",
                          }}
                          secondaryTypographyProps={{
                            fontSize: "13px !important",
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
          {isAdmin && (
            <PrimaryButton
              variant="contained"
              fullWidth
              sx={{ minWidth: 0, mt: 1 }}
              onClick={() => {
                setAddMember(true);
                // onClose();
              }}
              startIcon={<PersonAddOutlinedIcon />}
            >
              Add member
            </PrimaryButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
