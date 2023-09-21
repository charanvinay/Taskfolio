import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTask from "../../components/dialogs/AddTask";
import { getGroupData, setActiveGroup } from "../../redux/slices/groupSlice";
import { fetchTasks, getTaskData } from "../../redux/slices/taskSlice";
import { getUserData } from "../../redux/slices/userSlice";
import { COLORS, TASKTYPECOLORS, TASKTYPES } from "../../utils/constants";
import TaskSkeleton from "../../utils/skeletons/Task";
import Storage from "../../utils/localStore";
import NotFound from "../../components/PageNotFound";
const Tasks = () => {
  const [openAddTask, setOpenAddTask] = useState(false);
  const activeDate = useSelector((state) => getUserData(state, "activeDate"));
  const activeGroup = useSelector((state) =>
    getGroupData(state, "activeGroup")
  );
  const activeMember = useSelector((state) =>
    getGroupData(state, "activeMember")
  );
  const activeGroupData = useSelector((state) =>
    getGroupData(state, "activeGroupData")
  );
  const activeMemberData = useSelector((state) =>
    getGroupData(state, "activeMemberData")
  );
  const isLoggedUser = Storage.getJson("userData")?._id === activeMember;
  const tasks = useSelector((state) => getTaskData(state, "tasks"));
  const loading = useSelector((state) => getTaskData(state, "loading"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (activeGroup && activeMember) {
      dispatch(
        fetchTasks({
          activeDate,
          activeGroup,
          uid: activeMember,
        })
      );
    }
  }, [activeDate, activeGroup, activeMember]);

  return (
    <>
      <Stack spacing={2} sx={{ my: "10px" }}>
        <Stack>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "500",textTransform: "capitalize" }}
          >
            {isLoggedUser ? "My" : activeMemberData["fullName"]}
            {activeGroupData["_id"] && ` tasks in ${activeGroupData["title"]}`}
          </Typography>
          {activeMember && (
            <Box
              sx={{
                width: "40px",
                height: "2px",
                backgroundColor: COLORS["PRIMARY"],
                mb: "2px",
              }}
            ></Box>
          )}
          {activeMember && (
            <Box
              sx={{
                width: "20px",
                height: "2px",
                backgroundColor: COLORS["PRIMARY"],
              }}
            ></Box>
          )}
        </Stack>
        <Stack spacing={2}>
          {loading
            ? [1, 2, 3, 4, 5, 6].map((loader) => (
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
                          {TASKTYPES.find((t) => t.id === task.type)?.label ||
                            task.type}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
        </Stack>
      </Stack>
      {!activeGroup && (
        <NotFound
          text1="No groups found"
          text2="Create a group and add your tasks"
        />
      )}
      {(!tasks || tasks.length === 0) && (
        <NotFound
          text1="No tasks found"
          text2="Click on + button to create task"
        />
      )}
      {activeGroup && (
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
      )}
      {openAddTask && (
        <AddTask
          open={openAddTask}
          onClose={(e) => {
            setOpenAddTask(false);
            if (e && e.openGroup) {
              dispatch(setActiveGroup(e.openGroup));
            }
          }}
        />
      )}
    </>
  );
};

export default Tasks;
