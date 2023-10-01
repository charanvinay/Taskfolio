import {
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DropdownBtn from "../../../components/DropdownBtn";
import AddMember from "../../../components/dialogs/AddMember";
import ChangeMemberSM from "../../../components/dialogs/ChangeMemberSM";
import {
  fetchMembers,
  getGroupData
} from "../../../redux/slices/groupSlice";
const MembersSM = () => {
  const dispatch = useDispatch();
  const [addMember, setAddMember] = useState(false);
  const [changeMember, setChangeMember] = useState(false);
  const loading = useSelector((state) => getGroupData(state, "memberLoading"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeMemberData = useSelector((state) =>
    getGroupData(state, "activeMemberData")
  );
  
  useEffect(() => {
    if (activeGroup) {
      dispatch(fetchMembers({ id: activeGroup }));
    }
  }, [activeGroup]);

  return (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: "4px" }}>
        Member
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
          onClick={() => setChangeMember(true)}
          title={activeMemberData?.["fullName"]}
        />
      )}
      {changeMember && (
        <ChangeMemberSM
          open={changeMember}
          setAddMember={(e)=>setAddMember(e)}
          onClose={() => setChangeMember(false)}
        />
      )}
      {addMember && (
        <AddMember open={addMember} onClose={() => setAddMember(false)} />
      )}
    </Stack>
  );
};

export default MembersSM;
