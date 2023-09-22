import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const userData = Storage.getJson("userData");
  const [openJoinGroup, setOpenJoinGroup] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const loading = useSelector((state) => getGroupData(state, "loading"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const groups = useSelector((state) => getGroupData(state, "groups"));

  useEffect(() => {
    dispatch(fetchGroups({ uid: userData["_id"] }));
  }, []);

  return (
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
        component="nav"
        aria-labelledby="nested-list-subheader"
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
              groups.map((group, ind) => {
                const { _id, title } = group;
                const selected = _id === activeGroup;
                return (
                  <div key={_id}>
                    <ListItemButton
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
                  </div>
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
            <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
              <PrimaryButton
                variant="contained"
                fullWidth
                sx={{ minWidth: 0 }}
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateGroup(true)}
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
          onClose={() => setOpenCreateGroup(false)}
        />
      )}
    </Paper>
  );
};

export default Groups;
