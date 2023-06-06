import { Box, Typography, Stack, TextField as Text } from "@mui/material";
import logo from "../assets/Logo.svg";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import PasswordField from "../components/PasswordField";

interface FormValues {
  email: string;
  password: string;
}

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Ingresa tu correo, por favor")
    .email("Ingresa un correo válido, por favor"),
  password: yup.string().required("Ingresa tu contraseña, por favor"),
});

const Login = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      actions.setSubmitting(true);
      console.log(values);
      enqueueSnackbar("Inicio de sesión exitoso", { variant: "success" });
      navigate("/");
    } catch (error) {
      enqueueSnackbar(
        "Hubo un error al iniciar sesión, por favor intente de nuevo.",
        { variant: "error" }
      );
    } finally {
      actions.setSubmitting(false);
    }
  };
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
            xs: "95%",
            lg: "730px",
          },
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
        <Typography
          variant="h1"
          fontWeight={600}
          color="primary.main"
          fontSize={{ lg: "3rem", xs: "2rem" }}
        >
          Inicio de sesión
        </Typography>

        <Typography color="primary.main" fontWeight={500} fontSize="1.5rem">
          Ingrese sus datos para continuar
        </Typography>

        {/* Form with formik */}
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

              <Field
                component={PasswordField}
                name="password"
                label="Contraseña"
                required
              />

              <LoadingButton
                type="submit"
                loading={isSubmitting}
                loadingIndicator="Procesando..."
                variant="contained"
                color="primary"
              >
                Ingresar
              </LoadingButton>
              <Typography align="center">
                ¿No tienes cuenta?
                <Link to="/signup">
                  <Typography fontWeight="600"> Regístrate aquí </Typography>
                </Link>
              </Typography>
            </Stack>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
