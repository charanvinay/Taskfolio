import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import callApi from "../../api";
import {
  APIS,
  getTaskFormSchema
} from "../../utils/constants";
const { TASK, GET_FORMNAMES } = APIS;
const initialState = {
  tasks: [],
  formNames: [],
  loading: false,
  formSchema: getTaskFormSchema(),
  error: false,
  message: "",
  selectedStatus: "",
};
export const fetchTasks = createAsyncThunk(
  "task_slice/fetchTasks",
  async (
    args = {
      activeDate: "",
      activeWeek: null,
      activeGroup: "",
      uid: "",
      selectedStatus: "",
    }
  ) => {
    let { activeDate, activeWeek, activeGroup, uid, selectedStatus } = args;
    try {
      let url = `${TASK}?groupId=${activeGroup}&date=${activeDate}`;
      if (activeWeek) {
        let from = activeWeek,
          to = moment(activeWeek).add(5, "days").format("YYYY-MM-DD");
        url = `${TASK}?groupId=${activeGroup}&from=${from}&to=${to}`;
      }
      if (uid) {
        url += `&createdBy=${uid}`;
      }
      if (selectedStatus) {
        url += `&status=${selectedStatus}`;
      }
      const { status, data } = await callApi(url);
      if (status) {
        return {
          tasks: data["data"].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
          selectedStatus,
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const fetchFormNames = createAsyncThunk(
  "task_slice/fetchFormNames",
  async (args) => {
    let { groupId } = args;
    try {
      let url = `${GET_FORMNAMES}?groupId=${groupId}`;
      const { status, data } = await callApi(url);
      if (status) {
        return data["data"];
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const addTask = createAsyncThunk(
  "task_slice/addTask",
  async (args, { rejectWithValue, dispatch }) => {
    let { payload } = args;
    try {
      const { status, data } = await callApi(TASK, "POST", payload);
      if (status) {
        dispatch(
          fetchTasks({
            activeDate: payload["date"],
            activeGroup: payload["groupId"],
            selectedStatus: payload["status"],
          })
        );
        return {
          status,
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
export const updateTask = createAsyncThunk(
  "task_slice/updateTask",
  async (args, { rejectWithValue, dispatch }) => {
    let { payload } = args;
    try {
      const { status, data } = await callApi(
        `${TASK}/${payload["_id"]}`,
        "PUT",
        payload
      );
      if (status) {
        dispatch(
          fetchTasks({
            activeDate: payload["date"],
            activeGroup: payload["groupId"],
            selectedStatus: payload["status"],
          })
        );
        return {
          status,
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
export const deleteTask = createAsyncThunk(
  "task_slice/deleteTask",
  async (args, { rejectWithValue, dispatch }) => {
    let { payload } = args;
    const { _id, groupId, date } = payload;
    try {
      const { status, data } = await callApi(
        `${TASK}/${groupId}/${_id}`,
        "DELETE"
      );
      if (status) {
        dispatch(
          fetchTasks({
            activeDate: date,
            activeGroup: groupId,
            selectedStatus: payload["status"],
          })
        );
        return {
          status,
          message: data.message,
        };
      }
      return rejectWithValue({
        status,
        message: data.message,
      });
    } catch (error) {
      console.log(error);
      // throw error;
    }
  }
);
const taskSlice = createSlice({
  name: "task_slice",
  initialState: initialState,
  reducers: {
    handleTask: (state, action) => {
      state.formSchema.map((field) => {
        if (field.name === action.payload.name) {
          field.value = action.payload.value;
        }
      });
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    resetTask: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.selectedStatus = action.payload.selectedStatus;
        state.formSchema = initialState.formSchema;
        state.message = "";
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        console.log("Error: ", action.error.message);
      })
      .addCase(fetchFormNames.pending, (state) => {
        state.fetching = true;
      })
      .addCase(fetchFormNames.fulfilled, (state, action) => {
        state.fetching = false;
        state.formSchema.map((field) => {
          if (field.name === "formName") {
            field.options = action.payload;
          }
        });
      })
      .addCase(fetchFormNames.rejected, (state, action) => {
        state.fetching = false;
        console.log("Error: ", action.error.message);
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.message = action.payload.message;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.message;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "";
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.message = action.payload.message;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.message = "";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.message = action.payload.message;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.payload.message;
      });
  },
});

export const getTaskData = (state, key) => state.task[key];
export const { handleTask, setSelectedStatus, resetTask } = taskSlice.actions;
export default taskSlice.reducer;
