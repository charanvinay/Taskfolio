import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import callApi from "../../api";
import { APIS, TASKTYPES } from "../../utils/constants";
const { TASK, GET_FORMNAMES } = APIS;
const initialState = {
  tasks: [],
  formNames: [],
  loading: false,
  formSchema: [
    {
      id: 1,
      name: "groupId",
      label: "Group",
      element: "dropdown",
      freeSolo: false,
      value: null,
      placeholder: "Select a group",
    },
    {
      id: 2,
      name: "formName",
      label: "Form/Module/Page name",
      element: "dropdown",
      freeSolo: true,
      value: null,
      placeholder: "Eg: Doctor Assessment",
      options: [],
    },
    {
      id: 3,
      name: "type",
      label: "Type",
      element: "radio",
      value: TASKTYPES[0]["id"],
      options: TASKTYPES,
    },
    {
      id: 4,
      name: "title",
      label: "What have you done?",
      element: "input",
      value: null,
      multiline: true,
      placeholder: "Eg: Developed a user interface for billing form...",
    },
  ],
  error: false,
  message: "",
};
export const fetchTasks = createAsyncThunk(
  "task_slice/fetchTasks",
  async (args) => {
    let { activeDate, activeGroup, uid } = args;
    try {
      let url = `${TASK}?groupId=${activeGroup}&date=${activeDate}`;
      if(uid){
        url += `&createdBy=${uid}`;
      }
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
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
      });
  },
});

export const getTaskData = (state, key) => state.task[key];
export const { handleTask } = taskSlice.actions;
export default taskSlice.reducer;
