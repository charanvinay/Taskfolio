import {
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const PasswordFieldOutlined = (props) => {
  let { label, name, value, onChange } = props;
  const [showPass, setShowPass] = useState(false);
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2">{label}</Typography>
      <OutlinedInput
        fullWidth
        type={showPass ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        sx={{
          borderRadius: "8px",
          paddingTop: "2px",
          paddingBottom: "2px",
          fontSize: "14px",
          outline: "none !important",
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPass(!showPass)} edge="end">
              {!showPass ? <VisibilityOffOutlined /> : <RemoveRedEyeOutlined />}
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default PasswordFieldOutlined;
