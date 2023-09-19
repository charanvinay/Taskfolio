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
  async (args) => {
    const { uid } = args;
    try {
      let url = GROUP;
      if (uid) {
        url = `${GROUP}?uid=${uid}`;
      }
      const { status, data } = await callApi(url);
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

        // Check if the data is valid (non-empty) before updating the state
        if (data && data.length > 0) {
          state.groups = data;
          let firstGroup = data[0];
          state.activeGroup = firstGroup._id;
          state.activeGroupData = firstGroup;
        } else {
          // Handle the case where the data is empty or not valid
          // You can choose to do nothing or set state to a default value
        }
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
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
      });
  },
});

export const getGroupData = (state, key) => state.group[key];
export const { setActiveGroup, setActiveMember, resetGroup } =
  groupSlice.actions;

export default groupSlice.reducer;
