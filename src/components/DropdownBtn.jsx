import { ExpandMore } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";

const DropdownBtn = (props) => {
  const { onClick, title } = props;
  return (
    <ListItem
      disablePadding
      sx={{
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
      onClick={onClick}
    >
      <ListItemButton sx={{ p: 1, py: "5px" }}>
        <ListItemText
          primary={title}
          sx={{
            "& .MuiTypography-root": {
              noWrap: true,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          }}
          primaryTypographyProps={{
            fontSize: "12px",
          }}
        />
        <ExpandMore />
      </ListItemButton>
    </ListItem>
  );
};

export default DropdownBtn;
