import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./slices/userSlice";
import GroupReducer from "./slices/groupSlice";
import TaskReducer from "./slices/taskSlice";
import AuthReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
    group: GroupReducer,
    task: TaskReducer,
  },
});
