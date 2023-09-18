import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  getGroupData,
  setActiveGroup,
} from "../../../redux/slices/groupSlice";
import { COLORS } from "../../../utils/constants";
import Storage from "../../../utils/localStore";
const Groups = () => {
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData");
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
              height={50}
              variant="rectangular"
              sx={{ width: "100%", mb: 1 }}
              key={loader}
            />
          ))
        ) : (
          <>
            {groups &&
              groups.map((group, ind) => {
                const { _id, title } = group;
                return (
                  <div key={_id}>
                    <ListItemButton
                      onClick={() => dispatch(setActiveGroup(_id))}
                      selected={_id === activeGroup}
                    >
                      <ListItemText primary={title} />
                    </ListItemButton>
                    {groups.length - 1 !== ind && <Divider />}
                  </div>
                );
              })}
          </>
        )}
      </List>
    </Paper>
  );
};

export default Groups;
