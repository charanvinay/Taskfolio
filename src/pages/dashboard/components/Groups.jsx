import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ListSecondaryAction from "../../../components/ListSecondaryAction";
import CreateGroup from "../../../components/dialogs/CreateGroup";
import JoinGroup from "../../../components/dialogs/JoinGroup";
import PrimaryButton from "../../../components/wrappers/PrimaryButton";
import {
  fetchGroupDetails,
  fetchGroups,
  getGroupData,
} from "../../../redux/slices/groupSlice";
import { COLORS } from "../../../utils/constants";
import Storage from "../../../utils/localStore";
const Groups = () => {
  const dispatch = useDispatch();
  const activeRef = useRef(null);
  const userData = Storage.getJson("userData");
  const [openJoinGroup, setOpenJoinGroup] = useState(false);
  const [mode, setMode] = useState("add");
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const loading = useSelector((state) => getGroupData(state, "loading"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const groups = useSelector((state) => getGroupData(state, "groups"));

  useEffect(() => {
    dispatch(fetchGroups({ uid: userData["_id"] }));
  }, []);
  useEffect(() => {
    if (activeRef && activeRef.current) {
      activeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeGroup, loading]);

  const isAdmin = userData["_id"] === activeGroupData["createdBy"];
  return (
    <Paper
      sx={{
        borderRadius: "8px",
        padding: "10px",
        overflow: "hidden",
        boxShadow: "0px 1px 8px rgb(23 110 222 / 10%)",
        position: "sticky",
        top: "203px",
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
            Groups
          </Typography>
        }
      >
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
          <>
            {groups && groups.length > 0 ? (
              <Box
                sx={{ maxHeight: "calc(100vh - 350px)", overflowY: "scroll" }}
              >
                {groups.map((group, ind) => {
                  const { _id, title } = group;
                  const selected = _id === activeGroup;
                  return (
                    <ListItem
                      key={_id}
                      disablePadding
                      secondaryAction={
                        selected &&
                        isAdmin && (
                          <ListSecondaryAction
                            tooltip="Edit"
                            onClick={() => {
                              setOpenCreateGroup(true);
                              setMode("edit");
                            }}
                            icon={<FaRegEdit size={18} />}
                          />
                        )
                      }
                    >
                      <ListItemButton
                        ref={selected ? activeRef : null}
                        onClick={() => dispatch(fetchGroupDetails({ id: _id }))}
                        selected={selected}
                        sx={{
                          padding: "5px 10px",
                        }}
                      >
                        <ListItemText
                          primary={title}
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
                            color: selected && COLORS["PRIMARY"],
                          }}
                        />
                      </ListItemButton>
                      {groups.length - 1 !== ind && <Divider />}
                    </ListItem>
                  );
                })}
              </Box>
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
            <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
              <PrimaryButton
                variant="contained"
                fullWidth
                sx={{ minWidth: 0 }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setMode("add");
                  setOpenCreateGroup(true);
                }}
              >
                Create
              </PrimaryButton>
              <PrimaryButton
                variant="contained"
                fullWidth
                sx={{ minWidth: 0 }}
                startIcon={<LoginIcon />}
                onClick={() => setOpenJoinGroup(true)}
              >
                Join
              </PrimaryButton>
            </Stack>
          </>
        )}
      </List>
      {openJoinGroup && (
        <JoinGroup
          open={openJoinGroup}
          onClose={() => setOpenJoinGroup(false)}
        />
      )}
      {openCreateGroup && (
        <CreateGroup
          open={openCreateGroup}
          mode={mode}
          isAdmin={isAdmin}
          groupId={mode === "edit" && activeGroup}
          onClose={() => setOpenCreateGroup(false)}
        />
      )}
    </Paper>
  );
};

export default Groups;
