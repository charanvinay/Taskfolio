import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PasswordFieldOutlined from "../../../components/PasswordFieldOutlined";
import TextFieldOutlined from "../../../components/TextFieldOutlined";
import ErrorAlert from "../../../components/snackbars/ErrorAlert";
import { CursiveTextLG } from "../../../components/wrappers/CursiveTextLG";
import PrimaryButton from "../../../components/wrappers/PrimaryButton";
import { getAuthData, logout, register } from "../../../redux/slices/authSlice";
import { resetAll } from "../../../redux/slices/rootReducer";
import Storage from "../../../utils/localStore";
import Loader from "../../dashboard/components/Loader";
const Register = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = { email: "", fullName: "", password: "" };
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
  const isLoggedIn = Storage.get("token");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      dispatch(logout());
      dispatch(resetAll());
    }
  }, [isLoggedIn]);
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(handleValidation(formValues)).length !== 0) {
      setErrorText(Object.values(handleValidation(formValues))[0]);
      setsnackOpen(true);
    } else {
      dispatch(register(formValues));
    }
  };
  const handleSignUp = (e) => props.setSignUp(false);
  const handleValidation = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fullName) {
      errors.fullName = "Full name is required";
    }
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
    if (error) {
      setsnackOpen(true);
      setErrorText(error);
    }
  }, [error]);

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
            <CursiveTextLG variant="h4">Get Started</CursiveTextLG>
            <Typography
              variant="subtitle2"
              sx={{
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              Enter your credentials to create your account
            </Typography>
            <Box sx={{ height: "40px" }}></Box>
            <TextFieldOutlined
              label="Full name"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChanges}
            />
            <TextFieldOutlined
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleChanges}
            />
            <PasswordFieldOutlined
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChanges}
            />
            <PrimaryButton
              variant="contained"
              fullWidth={true}
              onClick={handleSubmit}
              sx={{ margin: "20px 0px 10px 0px" }}
            >
              Create account
            </PrimaryButton>
            <Button fullWidth={true} onClick={handleSignUp}>
              Already have an account?
            </Button>
          </Box>
        </Container>
      </Box>
      <ErrorAlert open={snackopen} onClose={handleClose} text={errorText} />
      <Loader open={loading} onClose={() => {}} />
    </Grid>
  );
};

export default Register;
