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
    fetchMembers,
    getGroupData,
    setActiveMember
} from "../../../redux/slices/groupSlice";
import { COLORS } from "../../../utils/constants";
const Members = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => getGroupData(state, "memberLoading"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeMember = useSelector((state) =>
    getGroupData(state, "activeMember")
  );
  const members = useSelector((state) => getGroupData(state, "members"));

  useEffect(() => {
    if (activeGroup) {
      dispatch(fetchMembers({ id: activeGroup }));
    }
  }, [activeGroup]);

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
            Members
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
            {members &&
              members.map((member, ind) => {
                const { _id, fullName, email } = member;
                return (
                  <div key={ind}>
                    <ListItemButton
                      onClick={() => dispatch(setActiveMember(_id))}
                      selected={_id === activeMember}
                    >
                      <ListItemText primary={fullName} secondary={email} />
                    </ListItemButton>
                    {members.length - 1 !== ind && <Divider />}
                  </div>
                );
              })}
          </>
        )}
      </List>
    </Paper>
  );
};

export default Members;
