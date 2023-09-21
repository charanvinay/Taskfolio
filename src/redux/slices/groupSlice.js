import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../api";
import { APIS } from "../../utils/constants";
const { GROUP, MEMBERS } = APIS;
const initialState = {
  activeGroup: "",
  activeMember: "",
  activeGroupData: {},
  activeMemberData: {},
  groups: [],
  loading: false,
  memberLoading: false,
};

export const fetchGroups = createAsyncThunk(
  "group_slice/fetchGroups",
  async (args, { dispatch }) => {
    const { uid } = args;
    try {
      let url = GROUP;
      if (uid) {
        url = `${GROUP}?uid=${uid}`;
      }
      const { status, data } = await callApi(url);
      if (status) {
        let groups = data.data;
        if (groups.length === 1) {
          dispatch(fetchGroupDetails({ id: groups[0]["_id"] }));
        }
        return groups;
      }
    } catch (error) {
      console.log(error);
      throw error; // Propagate the error
    }
  }
);
export const fetchGroupDetails = createAsyncThunk(
  "group_slice/fetchGroupDetails",
  async (args) => {
    const { id } = args;
    try {
      const { status, data } = await callApi(`${GROUP}/${id}`);
      if (status) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
      throw error; // Propagate the error
    }
  }
);
export const fetchMembers = createAsyncThunk(
  "group_slice/fetchMembers",
  async (args) => {
    const { id } = args;
    try {
      const { status, data } = await callApi(`group/${id}/${MEMBERS}`);
      if (status) {
        return data.data;
      }
    } catch (error) {
      console.log(error);
      throw error; // Propagate the error
    }
  }
);
export const joinGroup = createAsyncThunk(
  "group_slice/joinGroup",
  async (args, { rejectWithValue, dispatch }) => {
    let { id, uid } = args;
    let payload = { members: [uid] };
    try {
      const { status, data } = await callApi(`${GROUP}/${id}`, "PUT", payload);
      if (status) {
        dispatch(fetchMembers({ id }));
        return {
          status,
          data: data["data"],
          message: data.message,
        };
      }
      return rejectWithValue({
        status,
        message: data.message,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const removeMember = createAsyncThunk(
  "group_slice/removeMember",
  async (args, { rejectWithValue, dispatch }) => {
    let { id, uid } = args;
    try {
      const { status, data } = await callApi(`${GROUP}/${id}/${uid}`, "DELETE");
      if (status) {
        dispatch(fetchGroupDetails({id}))
        return {
          status,
          data: data["data"],
          message: data.message,
        };
      }
      return rejectWithValue({
        status,
        message: data.message,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
const groupSlice = createSlice({
  name: "group_slice",
  initialState: initialState,
  reducers: {
    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload;
      if (action.payload) {
        state.activeGroupData = state.groups.find(
          (g) => g._id === action.payload
        );
      }
    },
    setActiveMember: (state, action) => {
      state.activeMember = action.payload;
      if (action.payload) {
        state.activeMemberData = state.members.find(
          (g) => g._id === action.payload
        );
      }
    },
    resetGroup: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        if (data && data.length > 0) {
          state.groups = data;
          if(data.length > 1) {
            let firstGroup = data[0];
            state.activeGroup = firstGroup._id;
            state.activeGroupData = firstGroup;
          }
        }
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        console.error("Error:", action.error.message);
      })
      .addCase(fetchGroupDetails.pending, (state) => {
        state.memberLoading = true;
      })
      .addCase(fetchGroupDetails.fulfilled, (state, action) => {
        state.memberLoading = false;
        const data = action.payload;

        if (data && data["_id"]) {
          state.activeGroup = data._id;
          state.activeGroupData = data;
        }
      })
      .addCase(fetchGroupDetails.rejected, (state, action) => {
        state.memberLoading = false;
        console.error("Error:", action.error.message);
      })
      .addCase(fetchMembers.pending, (state) => {
        state.memberLoading = true;
        let userData = JSON.parse(localStorage.getItem("userData"));
        state.activeMember = userData["_id"];
        state.activeMemberData = userData;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.memberLoading = false;
        const data = action.payload;
        let userData = JSON.parse(localStorage.getItem("userData"));
        if (data && data.length > 0) {
          const userDataIndex = data.findIndex(
            (member) => member._id === userData["_id"]
          );

          // If userData is found, splice it from the array and add it as the first item
          if (userDataIndex !== -1) {
            const userData = data.splice(userDataIndex, 1)[0];
            state.members = [userData, ...data];
          } else {
            // If userData is not found, just assign the data as is
            state.members = data;
          }
        } else {
          // Handle the case where the data is empty or not valid
          // You can choose to do nothing or set state to a default value
        }
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.memberLoading = false;
        state.members = [];
      })
      .addCase(joinGroup.pending, (state) => {
        // state.loading = true;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        // state.loading = false;
        state.activeGroup = action.payload.data["_id"];
        state.activeGroupData = action.payload.data;
      })
      .addCase(joinGroup.rejected, (state, action) => {
        // state.loading = false;
      })
  },
});

export const getGroupData = (state, key) => state.group[key];
export const { setActiveGroup, setActiveMember, resetGroup } =
  groupSlice.actions;

export default groupSlice.reducer;
