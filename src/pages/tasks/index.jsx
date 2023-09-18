import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupData, setActiveGroup } from "../../redux/slices/groupSlice";
import { fetchTasks, getTaskData } from "../../redux/slices/taskSlice";
import { getUserData } from "../../redux/slices/userSlice";
import { COLORS, TASKTYPECOLORS } from "../../utils/constants";
import TaskSkeleton from "../../utils/skeletons/Task";
import AddTask from "../../components/dialogs/AddTask";
import Storage from "../../utils/localStore"
const Tasks = () => {
  const [openAddTask, setOpenAddTask] = useState(false);
  const userData = Storage.getJson("userData")
  const activeDate = useSelector((state) => getUserData(state, "activeDate"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const tasks = useSelector((state) => getTaskData(state, "tasks"));
  const loading = useSelector((state) => getTaskData(state, "loading"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (activeGroup) {
      dispatch(fetchTasks({ activeDate, activeGroup, uid: userData["_id"] }));
    }
  }, [activeDate, activeGroup]);

  return (
    <>
      <Stack spacing={2} sx={{ my: "10px" }}>
        <Stack>
          <Typography variant="body1" sx={{ fontWeight: "600" }}>
            Your tasks{" "}
            {activeGroupData["_id"] && `in ${activeGroupData["title"]}`}
          </Typography>
          <Box
            sx={{
              width: "40px",
              height: "2px",
              backgroundColor: COLORS["PRIMARY"],
              mb: "2px",
            }}
          ></Box>
          <Box
            sx={{
              width: "20px",
              height: "2px",
              backgroundColor: COLORS["PRIMARY"],
            }}
          ></Box>
        </Stack>
        <Stack spacing={2}>
          {loading
            ? [1, 2, 3, 4].map((loader) => (
                <div key={loader}>
                  <TaskSkeleton key={loader} />
                </div>
              ))
            : tasks &&
              tasks.length > 0 &&
              tasks.map((task) => {
                return (
                  <Paper
                    key={task._id}
                    sx={{
                      borderLeft: `6px solid ${TASKTYPECOLORS[task.type]}`,
                      padding: 2,
                    }}
                  >
                    <Typography variant="subtitle2">{task.title}</Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: "8px" }}
                    >
                      <Typography variant="caption">
                        In {task.formName}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: "5px",
                            height: "5px",
                            backgroundColor: TASKTYPECOLORS[task.type],
                            borderRadius: "50%",
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: "500",
                            textTransform: "uppercase",
                            letterSpacing: 1.2,
                          }}
                        >
                          {task.type}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
        </Stack>
      </Stack>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => {
          setOpenAddTask(true);
        }}
      >
        <AddIcon />
      </Fab>
      {openAddTask && <AddTask
        open={openAddTask}
        onClose={(e) => {
          setOpenAddTask(false);
          if (e && e.openGroup) {
            dispatch(setActiveGroup(e.openGroup))
          }
        }}
      />}
    </>
  );
};

export default Tasks;
