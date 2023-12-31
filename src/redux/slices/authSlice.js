import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import callApi from "../../api";
import { APIS, BASE_URL } from "../../utils/constants";
import Storage from "../../utils/localStore";
const { LOGIN, REGISTER, USER, FORGOT_PASSWORD, RESET_PASSWORD } = APIS;
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
        let storedData = { userData, token: accessToken };
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
export const forgotPassword = createAsyncThunk(
  "auth_slice/forgotPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}${FORGOT_PASSWORD}`,
        credentials
      );
      if (response.status === 200) {
        let { message } = response.data;
        return message;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth_slice/resetPassword",
  async (credentials, { rejectWithValue }) => {
    console.log(credentials);
    try {
      let { id, token, password } = credentials;
      const response = await axios.post(
        `${BASE_URL}${RESET_PASSWORD}/${id}/${token}`,
        { password }
      );
      if (response.status === 200) {
        let { message } = response.data;
        return message;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const register = createAsyncThunk(
  "auth_slice/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}${REGISTER}`, credentials);
      if (response.status === 200) {
        let { data } = response.data;
        let { userData, accessToken } = data;
        let storedData = { userData, token: accessToken };
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
export const updateUser = createAsyncThunk(
  "auth_slice/updateUser",
  async (payload, { rejectWithValue, dispatch }) => {
    // console.log(payload);
    try {
      const { status, data } = await callApi(
        `${USER}/${payload["_id"]}`,
        "PUT",
        payload
      );
      if (status) {
        let { data: userData } = data;
        Storage.store("userData", userData);
        return {
          status,
          data: userData,
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
const authSlice = createSlice({
  name: "auth_slice",
  initialState: initialState,
  reducers: {
    logout: (state, action) => {
      state.userData = {};
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
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.error = action.payload.message;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.error = action.payload.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.error = action.payload.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userData = action.payload.data;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userData = {};
        state.error = action.payload.message;
      });
  },
});
export const getAuthData = (state, key) => state.auth[key];
export const { logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;
