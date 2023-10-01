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
import { Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "../../components/PageNotFound";
import AddTask from "../../components/dialogs/AddTask";
import ErrorAlert from "../../components/snackbars/ErrorAlert";
import SuccessAlert from "../../components/snackbars/SuccessAlert";
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
import { HorizontalScroll } from "../../components/wrappers/HorizontalScroll";
import { TextStripes } from "../../components/wrappers/TextStripes";
const Tasks = () => {
  const [openAddTask, setOpenAddTask] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [successAlert, setSuccessAlert] = useState(false);
  const userData = Storage.getJson("userData");
  const activeDate = useSelector((state) => getUserData(state, "activeDate"));
  const activeWeek = useSelector((state) => getUserData(state, "activeWeek"));
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
  const isLoggedUser = userData?._id === activeMember;
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
      if (activeDate) {
        dispatch(
          fetchTasks({
            activeDate,
            activeGroup,
            uid: activeMember,
            selectedStatus,
          })
        );
      } else if (activeWeek) {
        dispatch(
          fetchTasks({
            activeWeek,
            activeGroup,
            uid: activeMember,
            selectedStatus,
          })
        );
      }
    }
  }, [activeDate, activeWeek, activeGroup, activeMember, selectedStatus]);
  const statuses = [
    { id: "", label: "All", color: COLORS["PRIMARY"] },
    ...TASK_STATUSES,
  ];
  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setSuccessAlert(true);
      setAlertText("Copied to clipboard");
    } catch (err) {
      setErrorAlert(true);
      setAlertText("Failed to copy!");
    }
  };
  const copyList = () => {
    const text = tasks.map((task) => ` •  ${task.title}`).join("\n");
    console.log(text);
    copyToClipBoard(text);
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TextStripes variant="subtitle2">
              {isLoggedUser ? "My" : activeMemberData?.["fullName"]}
              {activeGroupData["_id"] &&
                ` tasks in ${activeGroupData?.["title"]}`}
            </TextStripes>
            <Tooltip
              title={`Copy ${
                TASK_STATUSES.find((s) => s.id === selectedStatus)?.label ||
                "All"
              } tasks`}
              placement="bottom"
            >
              <IconButton onClick={copyList}>
                <ContentCopyOutlined sx={{ fontSize: "18px" }} />
              </IconButton>
            </Tooltip>
          </Stack>
          {activeMember && (
            <>
              <HorizontalScroll direction="row" spacing={1} sx={{ mt: 1 }}>
                {statuses.map((status) => {
                  const selected = status.id === selectedStatus;
                  return (
                    <Chip
                      label={status.label}
                      clickable={false}
                      key={status.id}
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
              </HorizontalScroll>
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
                const clickable =
                  task["createdBy"] === userData["_id"] && activeDate;
                return (
                  <Paper
                    key={task._id}
                    sx={{
                      borderLeft: `6px solid ${
                        TASK_STATUS_COLORS[task.status] || COLORS["PRIMARY"]
                      }`,
                      cursor: clickable && "pointer",
                      padding: 2,
                    }}
                    onClick={() => {
                      if (clickable) {
                        setOpenAddTask(true);
                        setSelectedTask(task);
                      }
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle2">{task.title}</Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipBoard(task.title);
                        }}
                      >
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
                        In {task.formName}
                        {activeWeek
                          ? " on " + moment(task.date).format("DD-MM-YYYY")
                          : " @ " + moment(task.createdAt).format("hh:mm a")}
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
          selectedTask={selectedTask}
          onClose={(e) => {
            setOpenAddTask(false);
            setSelectedTask(null);
            if (e && e.openGroup) {
              dispatch(setActiveGroup(e.openGroup));
            }
          }}
        />
      )}
      <SuccessAlert
        open={successAlert}
        text={alertText}
        onClose={() => setSuccessAlert(false)}
      />
      <ErrorAlert
        open={errorAlert}
        text={alertText}
        onClose={() => setErrorAlert(false)}
      />
    </>
  );
};

export default Tasks;
