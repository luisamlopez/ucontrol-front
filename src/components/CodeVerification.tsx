import { Box, Typography, Stack, TextField as Text } from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

export interface RecoverValue {
  recover: boolean;
  next: () => void;
}

interface FormValues {
  code: string;
}

const initialValues = {
  code: "",
};

const validationSchema = yup.object().shape({
  code: yup
    .string()
    .required("Ingrese el código recibido por correo, por favor"),
});

const CodeVerification = ({ recover, next }: RecoverValue): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      actions.setSubmitting(true);
      console.log(values);

      enqueueSnackbar("Código de verificación correcto.", {
        variant: "success",
      });
      next();
    } catch (error) {
      enqueueSnackbar(
        "Hubo un error al procesar su código, por favor intente de nuevo o verifique que el código sea el correcto.",
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
        Ingrese el código de verificación recibido.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Stack component={Form} spacing={2}>
            <Field
              component={TextField}
              name="code"
              label="Código de verificación"
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

export default CodeVerification;
