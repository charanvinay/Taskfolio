import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { APIS } from "../../utils/constants";
import Storage from "../../utils/localStore";
import { BASE_URL } from "../../utils/constants";
const { LOGIN } = APIS;
const initialState = {
  userData: {},
  error: null,
  loading: false,
};
export const login = createAsyncThunk(
  "auth_slice/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}${LOGIN}`, credentials);
      if (response.status === 200) {
        let { data } = response.data;
        let { userData, accessToken } = data;
        let storedData = { userData, token: accessToken }
        Storage.store("userData", userData);
        Storage.store("token", accessToken);
        return storedData;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
const authSlice = createSlice({
  name: "auth_slice",
  initialState: initialState,
  reducers: {
    logout: (state, action)=>{
        state.userData = {}
        Storage.remove("token");
        Storage.remove("userData");
    }, 
    resetAuth: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.error = action.payload.message;
      });
  },
});
export const getAuthData = (state, key) => state.auth[key];
export const {logout, resetAuth} = authSlice.actions;
export default authSlice.reducer;
