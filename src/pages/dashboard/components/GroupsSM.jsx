import {
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownBtn from "../../../components/DropdownBtn";
import ChangeGroupSM from "../../../components/dialogs/ChangeGroupSM";
import CreateGroup from "../../../components/dialogs/CreateGroup";
import JoinGroup from "../../../components/dialogs/JoinGroup";
import {
  fetchGroups,
  getGroupData
} from "../../../redux/slices/groupSlice";
import Storage from "../../../utils/localStore";
const GroupsSM = () => {
  const dispatch = useDispatch();
  const [changeGroup, setChangeGroup] = useState(false);
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

  useEffect(() => {
    dispatch(fetchGroups({ uid: userData?.["_id"] }));
  }, []);
  const isAdmin = userData?.["_id"] === activeGroupData["createdBy"];

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
        <DropdownBtn
          onClick={() => setChangeGroup(true)}
          title={activeGroupData["title"]}
        />
      )}
      {changeGroup && (
        <ChangeGroupSM
          open={changeGroup}
          setMode={(e) => setMode(e)}
          setOpenCreateGroup={(e) => setOpenCreateGroup(e)}
          setOpenJoinGroup={(e) => setOpenJoinGroup(e)}
          onClose={() => setChangeGroup(false)}
        />
      )}
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
    </Stack>
  );
};

export default GroupsSM;
