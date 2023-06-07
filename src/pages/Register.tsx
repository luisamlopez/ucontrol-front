import { Box, Typography, Stack, TextField as Text } from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import PasswordField from "../components/PasswordField";
import EmailRegistration from "../components/EmailRegistration";
import { useState } from "react";

const Register = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Registration steps (components) control
  const [sentEmail, setSentEmail] = useState(false);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(180deg, #042F3E 0%, #40B4E5 100%);",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "white",
          borderRadius: "8px",
          width: {
            xs: "80%",
            lg: "730px",
          },
          padding: "2rem",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: 330,
            m: 0,
          }}
        />
        {/* Step 1 */}
        <EmailRegistration />
        {/* Step 2 */}
      </Box>
    </Box>
  );
};

export default Register;
