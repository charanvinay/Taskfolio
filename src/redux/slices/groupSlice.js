import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../api";
import { APIS } from "../../utils/constants";
const { GROUP } = APIS;
const initialState = {
  activeGroup: "",
  activeGroupData: {},
  groups: [],
  loading: false,
};

export const fetchGroups = createAsyncThunk(
  "group_slice/fetchGroups",
  async (args) => {
    const { uid } = args;
    console.log(args)
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
      });
  },
});

export const getGroupData = (state, key) => state.group[key];
export const { setActiveGroup } = groupSlice.actions;

export default groupSlice.reducer;
