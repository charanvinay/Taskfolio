import { Skeleton, Stack } from "@mui/material";
import React from "react";

const TaskSkeleton = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rounded" height={75} sx={{width: "100%"}}/>
    </Stack>
  );
};

export default TaskSkeleton;
