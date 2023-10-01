import { Avatar, ListItemAvatar } from "@mui/material";
import React from "react";
import { DARKCOLORS } from "../utils/constants";

const ListAvatar = ({ letter }) => {
  return (
    <ListItemAvatar>
      <Avatar
        sx={{
          bgcolor: DARKCOLORS[letter.toLowerCase()],
          textTransform: "uppercase",
        }}
      >
        {letter}
      </Avatar>
    </ListItemAvatar>
  );
};

export default ListAvatar;
