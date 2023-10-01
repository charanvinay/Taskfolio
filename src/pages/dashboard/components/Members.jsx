import { PersonRemoveOutlined } from "@mui/icons-material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListAvatar from "../../../components/ListAvatar";
import ListSecondaryAction from "../../../components/ListSecondaryAction";
import AddMember from "../../../components/dialogs/AddMember";
import PrimaryButton from "../../../components/wrappers/PrimaryButton";
import {
  fetchMembers,
  getGroupData,
  removeMember,
  setActiveMember,
} from "../../../redux/slices/groupSlice";
import { COLORS } from "../../../utils/constants";
import Storage from "../../../utils/localStore";
const Members = () => {
  const dispatch = useDispatch();
  const [addMember, setAddMember] = useState(false);
  const userData = Storage.getJson("userData");
  const loading = useSelector((state) => getGroupData(state, "memberLoading"));
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
    if (activeGroup && activeGroupData) {
      dispatch(fetchMembers({ id: activeGroup }));
    }
  }, [activeGroup, activeGroupData]);
  const isAdmin = userData?.["_id"] === activeGroupData["createdBy"];
  return (
    <>
      {members && members.length > 0 && (
        <Paper
          sx={{
            borderRadius: "8px",
            padding: "10px",
            overflow: "hidden",
            boxShadow: "0px 1px 8px rgb(23 110 222 / 10%)",
            position: "sticky",
            top: "210px",
          }}
        >
          <List
            sx={{ width: "100%" }}
            subheader={
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "16px",
                  marginBottom: "10px",
                  color: COLORS["PRIMARY"],
                }}
              >
                Members ({members.length})
              </Typography>
            }
          >
            {loading ? (
              [1, 2].map((loader) => (
                <Skeleton
                  animation="wave"
                  height={50}
                  variant="rectangular"
                  sx={{ width: "100%", mb: 1 }}
                  key={loader}
                />
              ))
            ) : (
              <Box
                sx={{ maxHeight: "calc(100vh - 350px)", overflowY: "scroll" }}
              >
                {members &&
                  members.map((member, ind) => {
                    const { _id, fullName, email } = member;
                    const selected = _id === activeMember;
                    return (
                      <ListItem
                        key={ind}
                        disablePadding
                        secondaryAction={
                          isAdmin &&
                          _id !== userData["_id"] && (
                            <ListSecondaryAction
                              tooltip="Remove"
                              onClick={() => {
                                dispatch(
                                  removeMember({
                                    id: activeGroup,
                                    uid: _id,
                                  })
                                );
                              }}
                              icon={<PersonRemoveOutlined />}
                            />
                          )
                        }
                      >
                        <ListItemButton
                          onClick={() => dispatch(setActiveMember(_id))}
                          // selected={selected}
                          sx={{
                            padding: "5px 10px",
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
                        {members.length - 1 !== ind && <Divider />}
                      </ListItem>
                    );
                  })}
              </Box>
            )}
            {isAdmin && (
              <PrimaryButton
                variant="contained"
                fullWidth
                sx={{ minWidth: 0, mt: 1 }}
                onClick={() => setAddMember(true)}
                startIcon={<PersonAddOutlinedIcon />}
              >
                Add member
              </PrimaryButton>
            )}
          </List>
        </Paper>
      )}
      {addMember && (
        <AddMember open={addMember} onClose={() => setAddMember(false)} />
      )}
    </>
  );
};

export default Members;
