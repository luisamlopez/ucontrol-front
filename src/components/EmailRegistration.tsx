import { Box, Typography, Stack, TextField as Text } from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

interface FormValues {
  email: string;
}

const initialValues = {
  email: "",
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Ingresa tu correo, por favor")
    .email("Ingresa un correo válido, por favor"),
});

const EmailRegistration = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [sentCode, setSentCode] = useState(false);

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      actions.setSubmitting(true);
      console.log(values);
      enqueueSnackbar(
        "Código de verificación enviado, revise su correo UCAB.",
        { variant: "success" }
      );
      setSentCode(true);
    } catch (error) {
      enqueueSnackbar(
        "Hubo un error al enviar su código, por favor intente de nuevo o verifique que el correo sea el indicado.",
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
      <Typography
        variant="h1"
        fontWeight={600}
        color="primary.main"
        fontSize={{ lg: "3rem", xs: "2rem" }}
        textAlign={"center"}
      >
        Generación de contraseña
      </Typography>

      <Typography
        color="primary.main"
        fontWeight={500}
        fontSize={{ lg: "1.5rem", xs: "1rem" }}
        mb={2}
        textAlign={"center"}
      >
        Ingrese su correo UCAB para recibir el código de verificación y así
        poder crear su nueva contraseña.
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
              name="email"
              label="Correo UCAB"
              required
            />

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingIndicator="Procesando..."
              variant="contained"
              color="primary"
            >
              Enviar código de acceso
            </LoadingButton>

            <Typography align="center">
              ¿Ya tiene su contraseña de acceso?
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography fontWeight="600" color="primary.main">
                  Inicie sesión
                </Typography>
              </Link>
            </Typography>
          </Stack>
        )}
      </Formik>
    </Box>
  );
};

export default EmailRegistration;
