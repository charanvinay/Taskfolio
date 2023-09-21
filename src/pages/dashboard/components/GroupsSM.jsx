import {
  Autocomplete,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroupDetails,
  fetchGroups,
  getGroupData
} from "../../../redux/slices/groupSlice";
import Storage from "../../../utils/localStore";
const GroupsSM = () => {
  const dispatch = useDispatch();
  const userData = Storage.getJson("userData");
  const loading = useSelector((state) => getGroupData(state, "loading"));
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const groups = useSelector((state) => getGroupData(state, "groups"));

  useEffect(() => {
    dispatch(fetchGroups({ uid: userData["_id"] }));
  }, []);

  return (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: "4px" }}>
        Group
      </Typography>
      {loading ? (
        <Skeleton
          animation="wave"
          height={40}
          variant="rectangular"
          sx={{ width: "100%", mb: 1 }}
        />
      ) : (
        <Autocomplete
          value={activeGroupData["title"]}
          options={groups.map((g) => g.title)}
          renderInput={(params) => <TextField {...params} />}
          onChange={(e, inpVal) => {
            let val = inpVal;
            val = groups.find((g) => g.title === inpVal)?._id;
            dispatch(fetchGroupDetails({ id: val }));
          }}
        />
      )}
    </Stack>
  );
};

export default GroupsSM;
