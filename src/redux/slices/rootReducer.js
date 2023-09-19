// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import authReducer, { resetAuth } from './authSlice';
import taskReducer, { resetTask } from './taskSlice';
import userReducer, { resetUser } from './userSlice';
import groupReducer, { resetGroup } from './groupSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
  user: userReducer,
  group: groupReducer
  // Add other reducers here if you have more slices
});

export const resetAll = () => (dispatch) => {
  dispatch(resetAuth());
  dispatch(resetTask());
  dispatch(resetUser());
  dispatch(resetGroup());
  // Dispatch reset actions for other slices if you have more
};

export default rootReducer;
