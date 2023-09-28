import { ContentCopyOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Chip,
  Fab,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "../../components/PageNotFound";
import AddTask from "../../components/dialogs/AddTask";
import { getGroupData, setActiveGroup } from "../../redux/slices/groupSlice";
import {
  fetchTasks,
  getTaskData,
  setSelectedStatus,
} from "../../redux/slices/taskSlice";
import { getUserData } from "../../redux/slices/userSlice";
import {
  COLORS,
  TASKTYPECOLORS,
  TASKTYPES,
  TASK_STATUSES,
  TASK_STATUS_COLORS,
} from "../../utils/constants";
import Storage from "../../utils/localStore";
import TaskSkeleton from "../../utils/skeletons/Task";
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
  const selectedStatus = useSelector((state) =>
    getTaskData(state, "selectedStatus")
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      activeGroup &&
      activeMember &&
      (selectedStatus || selectedStatus === "")
    ) {
      dispatch(
        fetchTasks({
          activeDate,
          activeGroup,
          uid: activeMember,
          selectedStatus,
        })
      );
    }
  }, [activeDate, activeGroup, activeMember, selectedStatus]);
  const statuses = [
    { id: "", label: "All", color: COLORS["PRIMARY"] },
    ...TASK_STATUSES,
  ];
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "500", textTransform: "capitalize" }}
            >
              {isLoggedUser ? "My" : activeMemberData["fullName"]}
              {activeGroupData["_id"] &&
                ` tasks in ${activeGroupData["title"]}`}
            </Typography>
            <IconButton>
              <ContentCopyOutlined sx={{ fontSize: "18px" }} />
            </IconButton>
          </Stack>
          {activeMember && (
            <>
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
              <Stack
                direction="row"
                className="hide-scrollbar-x"
                spacing={1}
                sx={{ overflowX: "scroll", mt: 1 }}
              >
                {statuses.map((status) => {
                  const selected = status.id === selectedStatus;
                  return (
                    <Chip
                      label={status.label}
                      clickable={false}
                      variant={!selected ? "outlined" : "filled"}
                      onClick={() => dispatch(setSelectedStatus(status.id))}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: selected && status.color,
                        color: selected && "white",
                      }}
                    />
                  );
                })}
              </Stack>
            </>
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
                      borderLeft: `6px solid ${
                        TASK_STATUS_COLORS[task.status] || COLORS["PRIMARY"]
                      }`,
                      padding: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle2">{task.title}</Typography>
                      <IconButton size="small">
                        <ContentCopyOutlined fontSize="14px" />
                      </IconButton>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: "4px" }}
                    >
                      <Typography variant="caption">
                        In {task.formName} @{" "}
                        {moment(task.createdAt).format("hh:mm a")}
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
      </Box>
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
