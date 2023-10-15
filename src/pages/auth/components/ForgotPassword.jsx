import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmailSent from "../../../Assets/emailsent.png";
import TextFieldOutlined from "../../../components/TextFieldOutlined";
import ErrorAlert from "../../../components/snackbars/ErrorAlert";
import { CursiveTextLG } from "../../../components/wrappers/CursiveTextLG";
import PrimaryButton from "../../../components/wrappers/PrimaryButton";
import {
    forgotPassword,
    getAuthData,
    logout
} from "../../../redux/slices/authSlice";
import { resetAll } from "../../../redux/slices/rootReducer";
import Storage from "../../../utils/localStore";
import Loader from "../../dashboard/components/Loader";
const ForgotPassword = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [sentEmail, setSentEmail] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [snackopen, setsnackOpen] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setErrorText(handleValidation());
      setsnackOpen(true);
    } else {
      dispatch(forgotPassword({ email })).then(() => {
        setSentEmail(true);
      });
      //   navigate(`/`);
    }
  };
  const handleSignUp = (e) => props.authType("login");

  const handleValidation = () => {
    let error = "";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!email) {
      error = "Email is required!";
    } else if (!regex.test(email)) {
      error = "This is not a valid email format!";
    }
    return error;
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
          {sentEmail ? (
            <Stack
              spacing={8}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={EmailSent}
                alt="Email sent"
                style={{
                  width: "50%",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                A reset link was sent to <b>{email}</b>. Kindly open that link
                to reset your password.
              </Typography>
            </Stack>
          ) : (
            <Box>
              <CursiveTextLG variant="h4">Forgot Password?</CursiveTextLG>
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                Don't worry, send us your registered email to reset your password
              </Typography>
              <Box sx={{ height: "40px" }}></Box>
              <TextFieldOutlined
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PrimaryButton
                variant="contained"
                fullWidth={true}
                onClick={handleSubmit}
                sx={{ margin: "20px 0px 10px 0px" }}
              >
                Send reset link
              </PrimaryButton>
              <Button fullWidth={true} onClick={handleSignUp}>
                Go back
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      <ErrorAlert open={snackopen} onClose={handleClose} text={errorText} />
      <Loader open={loading} onClose={() => {}} />
    </Grid>
  );
};

export default ForgotPassword;
