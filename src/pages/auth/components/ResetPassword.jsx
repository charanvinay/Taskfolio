import { Box, Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UnAuthorized from "../../../Assets/unathorized.png";
import PasswordFieldOutlined from "../../../components/PasswordFieldOutlined";
import ErrorAlert from "../../../components/snackbars/ErrorAlert";
import { CursiveTextLG } from "../../../components/wrappers/CursiveTextLG";
import PrimaryButton from "../../../components/wrappers/PrimaryButton";
import { getAuthData, resetPassword } from "../../../redux/slices/authSlice";
import { APIS, BASE_URL } from "../../../utils/constants";
import Loader from "../../dashboard/components/Loader";
const { RESET_PASSWORD } = APIS;

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, token } = useParams();

  const initialValues = { password: "", confirmPassword: "" };
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(false);
  const [snackopen, setsnackOpen] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [userName, setUserName] = useState("");
  const [formValues, setformValues] = useState(initialValues);
  const error = useSelector((state) => getAuthData(state, "error"));
  const pageLoading = useSelector((state) => getAuthData(state, "loading"));

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
  const gotoLogin = () => {
    navigate("/");
    props.authType("login");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(handleValidation(formValues)).length !== 0) {
      setErrorText(Object.values(handleValidation(formValues))[0]);
      setsnackOpen(true);
    } else {
      console.log("sdfsd");
      dispatch(
        resetPassword({ id, token, password: formValues.password })
      ).then(() => {
        gotoLogin();
      });
      //   navigate(`/`);
    }
  };

  const handleValidation = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
    } else if (values.password !== values.confirmPassword) {
      errors.password = "Re-enter the same password";
    }
    return errors;
  };

  useEffect(() => {
    if (error) {
      setsnackOpen(true);
      setErrorText(error);
    }
  }, [error]);

  useEffect(() => {
    if (id && token) {
      verifyLink();
    } else {
      navigate("/");
    }
  }, [id, token]);

  const verifyLink = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${RESET_PASSWORD}/${id}/${token}`
      );
      if (response.status === 200) {
        setUserName(response.data.data.fullName);
        setLoading(false);
      } else {
        setInvalidLink(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setInvalidLink(true);
      setLoading(false);
    }
  };

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
        {invalidLink ? (
          <Box>
            <Button sx={{ ml: 2 }} onClick={gotoLogin}>{`< Login`}</Button>
            <img
              src={UnAuthorized}
              alt="UnAuthorized"
              style={{
                width: "100%",
              }}
            />
          </Box>
        ) : (
          <Container maxWidth="xs">
            <Box>
              <CursiveTextLG variant="h4">Change your password</CursiveTextLG>
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: "center",
                  fontSize: "13px",
                }}
              >
                Hi {userName}, Enter your new password to change your
                credentials
              </Typography>
              <Box sx={{ height: "40px" }}></Box>
              <PasswordFieldOutlined
                label="New Password"
                name="password"
                value={formValues.password}
                onChange={handleChanges}
              />
              <PasswordFieldOutlined
                label="Re-enter Password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChanges}
              />
              <PrimaryButton
                variant="contained"
                fullWidth={true}
                onClick={handleSubmit}
                sx={{ margin: "20px 0px 10px 0px" }}
              >
                Change
              </PrimaryButton>
            </Box>
          </Container>
        )}
      </Box>
      <ErrorAlert open={snackopen} onClose={handleClose} text={errorText} />
      <Loader open={loading || pageLoading} onClose={() => {}} />
    </Grid>
  );
};

export default ResetPassword;
