import { createSlice } from "@reduxjs/toolkit";
import moment from "moment/moment";

const initialState = {
  activeStep: 0,
  isMobile: true,
  isDarkMode: false,
  activeDate: moment().format("YYYY-MM-DD"),
};
export const userSlice = createSlice({
  name: "user_slice",
  initialState: initialState,
  reducers: {
    setActiveDate: (state, action) => {
      state.activeDate = action.payload;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const getUserData = (state, key) => state.user[key];
export const { setIsMobile, setIsDarkMode, setActiveDate } = userSlice.actions;
export default userSlice.reducer;
