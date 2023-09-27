import { IconButton, Tooltip, useTheme } from "@mui/material";
import React from "react";
import { COLORS } from "../utils/constants";

const ListSecondaryAction = (props) => {
  const theme = useTheme();
  const { tooltip, onClick, icon } = props;
  return (
    <Tooltip title={tooltip}>
      <IconButton
        edge="end"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: COLORS["PRIMARY"],
        }}
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default ListSecondaryAction;
