import {
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../../components/snackbars/ErrorAlert";
import PrimaryButton from "../../../components/wrappers/PrimaryButton";
import { getAuthData, login } from "../../../redux/slices/authSlice";
import { COLORS } from "../../../utils/constants";
import Storage from "../../../utils/localStore";
import Loader from "../../dashboard/components/Loader";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = Storage.get("token")

  const initialValues = { email: "", password: "" };
  const [showPass, setShowPass] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [errorText, setErrorText] = useState(false);
  const [snackopen, setsnackOpen] = useState(false);
  const [formValues, setformValues] = useState(initialValues);
  const error = useSelector((state) => getAuthData(state, "error"));
  const loading = useSelector((state) => getAuthData(state, "loading"));
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setsnackOpen(false);
  };
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setformErrors(handleValidation(formValues));
    console.log(handleValidation(formValues));
    if (Object.values(handleValidation(formValues)).length !== 0) {
      setErrorText(Object.values(handleValidation(formValues))[0]);
      setsnackOpen(true);
    } else {
      setIsSubmit(true);
      dispatch(login(formValues));
      //   navigate(`/`);
    }
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    navigate(`/register`);
  };
  const handleForgot = (e) => {
    navigate("/Forgotpassword");
  };

  const handleValidation = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 2) {
      errors.password = "Password must be more than 2 characters";
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // navigate("/changepassword");
    }
  }, [formErrors]);

  useEffect(() => {
    if (error) {
      setsnackOpen(true);
      setErrorText(error);
    }
  }, [error]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn]);

  return (
    <Grid item xs={12} sm={12} md={6} lg={6}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Container maxWidth="xs">
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "500",
                textAlign: "center",
                lineHeight: 2,
                color: COLORS["PRIMARY"],
                textTransform: "capitalize",
                fontFamily: "Pacifico, cursive !important",
              }}
            >
              Welcome back
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              Enter your credentials to access your account
            </Typography>
            <Box sx={{ height: "40px" }}></Box>
            <Typography variant="subtitle2">Email</Typography>
            <OutlinedInput
              fullWidth
              name="email"
              value={formValues.email}
              onChange={handleChanges}
              sx={{ borderRadius: "8px", padding: "4px 0px" }}
            />
            <Box sx={{ height: "20px" }}></Box>
            <Typography variant="subtitle2">Password</Typography>
            <OutlinedInput
              fullWidth
              type={showPass ? "text" : "password"}
              onChange={handleChanges}
              value={formValues.password}
              sx={{
                borderRadius: "8px",
                paddingTop: "4px",
                paddingBottom: "4px",
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? (
                      <VisibilityOffOutlined />
                    ) : (
                      <RemoveRedEyeOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              name="password"
            />
            <Box sx={{ display: "flex", justifyContent: "end", mt: 1 }}>
              <Button onClick={handleForgot}>Forgot Password?</Button>
            </Box>
            <Box sx={{ margin: "20px 0px 10px 0px" }}>
              <PrimaryButton
                variant="contained"
                fullWidth={true}
                onClick={handleSubmit}
              >
                Login
              </PrimaryButton>
            </Box>
            <Box>
              <Button fullWidth={true} onClick={handleSignUp}>
                Don't have an account?
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <ErrorAlert open={snackopen} onClose={handleClose} text={errorText} />
      <Loader open={loading} onClose={() => {}} />
    </Grid>
  );
};

export default Login;
