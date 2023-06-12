import { Box, Typography, Stack, TextField as Text } from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import PasswordField from "./PasswordField";

export interface RecoverValue {
  recover: boolean;
  next: () => void;
}

interface FormValues {
  password: string;
  passwordRepeat: string;
}

const initialValues = {
  password: "",
  passwordRepeat: "",
};

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Ingrese su contraseña, por favor")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  passwordRepeat: yup
    .string()
    .required("Ingrese su contraseña, por favor")
    .test("passwordRepeated", "Las contraseñas no coinciden", function (value) {
      return value === this.parent.password;
    }),
});

const PasswordCreation = ({ recover, next }: RecoverValue): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      actions.setSubmitting(true);
      console.log(values);

      enqueueSnackbar(
        "Contraseña creada exitosamente, ya puede ingresar sesión.",
        {
          variant: "success",
        }
      );
      navigate("/login");
    } catch (error) {
      enqueueSnackbar(
        "Hubo un error al procesar su contraseña, por favor intente de nuevo.",
        { variant: "error" }
      );
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {recover ? (
        <Typography
          variant="h1"
          fontWeight={600}
          color="primary.main"
          fontSize={{ lg: "3rem", xs: "2rem" }}
          textAlign={"center"}
        >
          Recuperación de contraseña
        </Typography>
      ) : (
        <Typography
          variant="h1"
          fontWeight={600}
          color="primary.main"
          fontSize={{ lg: "3rem", xs: "2rem" }}
          textAlign={"center"}
        >
          Generación de contraseña
        </Typography>
      )}

      <Typography
        color="primary.main"
        fontWeight={500}
        fontSize={{ lg: "1.5rem", xs: "1rem" }}
        mb={2}
        textAlign={"center"}
      >
        Ingrese su contraseña.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Stack component={Form} spacing={2}>
            <Field
              component={PasswordField}
              name="password"
              label="Contraseña"
              required
            />

            <Field
              component={PasswordField}
              name="passwordRepeat"
              label="Repetir contraseña"
              required
            />

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingIndicator="Procesando..."
              variant="contained"
              color="primary"
            >
              Continuar
            </LoadingButton>
          </Stack>
        )}
      </Formik>
    </Box>
  );
};

export default PasswordCreation;
