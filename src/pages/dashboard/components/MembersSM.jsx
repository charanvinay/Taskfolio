import {
  Autocomplete,
  Avatar,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  getGroupData,
  setActiveMember,
} from "../../../redux/slices/groupSlice";
import { COLORS, DARKCOLORS, getRandomColor } from "../../../utils/constants";
const MembersSM = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => getGroupData(state, "memberLoading"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeMemberData = useSelector((state) =>
    getGroupData(state, "activeMemberData")
  );
  const members = useSelector((state) => getGroupData(state, "members"));

  useEffect(() => {
    if (activeGroup) {
      dispatch(fetchMembers({ id: activeGroup }));
    }
  }, [activeGroup]);

  return (
    <Stack>
      <Typography variant="subtitle2" sx={{mb:"4px"}}>Member</Typography>
      {loading ? (
        <Skeleton
          animation="wave"
          height={50}
          variant="rectangular"
          sx={{ width: "100%", mb: 1 }}
        />
      ) : (
        <Autocomplete
          value={activeMemberData["fullName"]}
          options={members ? members.map((g) => g.fullName): []}
          renderInput={(params) => <TextField {...params} />}
          onChange={(e, inpVal) => {
            let val = inpVal;
            val = members.find((g) => g.fullName === inpVal)?._id;
            dispatch(setActiveMember(val));
          }}
        />
      )}
    </Stack>
  );
};

export default MembersSM;
