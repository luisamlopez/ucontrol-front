import {
  Box,
  Typography,
  Stack,
  TextField as Text,
  IconButton,
} from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import PasswordField from "../components/Fields/PasswordField";
import EmailRegistration from "../components/Register/EmailRegistration";
import { useState } from "react";
import CodeVerification from "../components/Register/CodeVerification";
import PasswordCreation from "../components/Register/PasswordCreation";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";

function Register(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Registration steps (components) control
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  function nextStep() {
    setCurrentStep(currentStep + 1);
  }

  function prevStep() {
    setCurrentStep(currentStep - 1);
  }

  const handleEmail = (email: string) => {
    setEmail(email);
  };

  const handleCode = (code: string) => {
    setCode(code);
  };

  let currentComponent;

  switch (currentStep) {
    case 1:
      currentComponent = (
        <EmailRegistration
          next={nextStep}
          handleEmail={handleEmail}
          handleCode={handleCode}
          prev={prevStep}
        />
      );
      break;
    case 2:
      currentComponent = (
        <CodeVerification
          checkCode={code}
          recover={false}
          next={nextStep}
          prev={prevStep}
        />
      );
      break;
    case 3:
      currentComponent = (
        <PasswordCreation
          email={email}
          recover={false}
          next={nextStep}
          prev={prevStep}
        />
      );
      break;
    default:
      currentComponent = (
        <EmailRegistration
          next={nextStep}
          handleEmail={handleEmail}
          handleCode={handleCode}
          prev={prevStep}
        />
      );
  }

  function prev() {
    navigate("/login");
  }

  return (
    <Box
      m={0}
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
        {currentComponent}

        <Typography align="center" mt={2}>
          ¿Ya tiene su contraseña de acceso?
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Typography fontWeight="600" color="primary.main">
              Inicie sesión
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
