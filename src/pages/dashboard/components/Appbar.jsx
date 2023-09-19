import { Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { DUMMY_AVATAR_URL } from "../../../utils/constants";
import HorizontalCalendar from "./HorizontalCalender";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Storage from "../../../utils/localStore"
import { resetAll } from "../../../redux/slices/rootReducer";

const SETTINGS = [
  { id: "profile", label: "Profile" },
  { id: "logout", label: "Logout" },
];

function DashboardAppbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const userData = Storage.getJson("userData")
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (id) => {
    setAnchorElUser(null);
    if(id === "logout"){
      dispatch(logout())
      dispatch(resetAll());
      navigate("/")
    }
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              textDecoration: "none",
              flexGrow: 1,
              color: "whitesmoke",
              textTransform: "capitalize"
            }}
          >
            Hi {userData["fullName"]}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="USER_NAME" src={DUMMY_AVATAR_URL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {SETTINGS.map((setting) => (
                <MenuItem
                  key={setting.id}
                  onClick={() => handleCloseUserMenu(setting.id)}
                >
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
        <HorizontalCalendar />
      </Container>
    </AppBar>
  );
}
export default DashboardAppbar;
