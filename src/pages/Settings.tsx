import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import HistoryAccordion from "../components/HistoryPage/HistoryAccordion";
import HistoryTable from "../components/HistoryPage/HistoryTable";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../contexts/authContext";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useState } from "react";
import PasswordField from "../components/Fields/PasswordField";
import { LoadingButton } from "@mui/lab";

interface ChangePaswordFormValues {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const changePasswordInitialValues = {
  oldPassword: "",
  newPassword: "",
  newPasswordConfirmation: "",
};

const CPValidationSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Ingrese su contraseña actual, por favor")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  newPassword: yup
    .string()
    .required("Ingrese su nueva contraseña, por favor")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  newPasswordConfirmation: yup
    .string()
    .required("Confirme su nueva contraseña, por favor")
    .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden"),
});

const SettingsPage = (): JSX.Element => {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] =
    useState<string>("");

  const onChangePassword = async (
    values: ChangePaswordFormValues,
    actions: FormikHelpers<ChangePaswordFormValues>
  ) => {
    try {
      actions.setSubmitting(true);
      /**
       * TODO: Add change password functionality
       */
      // const response = await login(values);
      // if (response.success) {
      enqueueSnackbar("response.message", { variant: "success" });
      // } else {
      //   enqueueSnackbar(response.message, { variant: "error" });
      // }
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0 }}>
        <Box
          display={"flex"}
          flexDirection="column"
          sx={{
            p: 2,
          }}
        >
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, sm: 48, lg: 48 }}
            fontWeight={600}
            p={0}
            mt={{ xs: 6, sm: 0, lg: 0 }}
            mb={2}
          >
            Configuración
          </Typography>
          <Box
            sx={{
              width: "40%",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
              }}
            >
              Cambio de contraseña
            </Typography>

            <Formik
              initialValues={changePasswordInitialValues}
              onSubmit={onChangePassword}
              validationSchema={CPValidationSchema}
            >
              {({ isSubmitting }) => (
                <Stack>
                  <Field
                    component={PasswordField}
                    name="oldPassword"
                    label="Contraseña actual"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    component={PasswordField}
                    name="newPassword"
                    label="Nueva contraseña"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    component={PasswordField}
                    name="newPasswordConfirmation"
                    label="Confirmar contraseña"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    loadingIndicator={
                      <CircularProgress size={24} color="secondary" />
                    }
                    sx={{
                      width: "fit-content",
                    }}
                  >
                    Cambiar
                  </LoadingButton>
                </Stack>
              )}
            </Formik>
          </Box>

          <Box
            sx={{
              width: "40%",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 500,
              }}
            >
              ¿Desea recibir notificaciones de los espacios a los cuales está
              suscrito?
            </Typography>

            <Formik
              initialValues={changePasswordInitialValues}
              onSubmit={onChangePassword}
              validationSchema={CPValidationSchema}
            >
              {({ isSubmitting }) => (
                <Stack>
                  <Field
                    component={PasswordField}
                    name="oldPassword"
                    label="Contraseña actual"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    component={PasswordField}
                    name="newPassword"
                    label="Nueva contraseña"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    component={PasswordField}
                    name="newPasswordConfirmation"
                    label="Confirmar contraseña"
                    type="password"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    loadingIndicator={
                      <CircularProgress size={24} color="secondary" />
                    }
                    sx={{
                      width: "fit-content",
                    }}
                  >
                    Cambiar
                  </LoadingButton>
                </Stack>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SettingsPage;
