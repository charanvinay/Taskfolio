import { Box, OutlinedInput, Typography } from "@mui/material";
import React from "react";

const TextFieldOutlined = (props) => {
  let { label, name, value, onChange } = props;
  return (
    <Box sx={{mb:2}}>
      <Typography variant="subtitle2">{label}</Typography>
      <OutlinedInput
        fullWidth
        name={name}
        value={value}
        onChange={onChange}
        sx={{ borderRadius: "8px", padding: "2px 0px", fontSize: "14px" }}
      />
    </Box>
  );
};

export default TextFieldOutlined;
