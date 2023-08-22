import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Stack,
  FormControlLabel,
  FormLabel,
  Radio,
} from "@mui/material";
import HistoryAccordion from "../components/HistoryPage/HistoryAccordion";
import HistoryTable from "../components/HistoryPage/HistoryTable";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../contexts/authContext";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useState } from "react";
import PasswordField from "../components/Fields/PasswordField";
import { LoadingButton } from "@mui/lab";
import useAutosave from "../hooks/useAutosave.hook";

interface ChangePaswordFormValues {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

interface NotificationsFormValues {
  notifications: boolean;
}

const SettingsPage = (): JSX.Element => {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const changePasswordInitialValues = {
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  };

  const notificationsInitialValues = {
    notifications: true,
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

  const notificationsValidationSchema = yup.object().shape({
    notifications: yup.boolean().required("Seleccione una opción, por favor"),
  });

  useAutosave(() => {
    alert(
      "Se ha guardado su configuración de notificaciones (aqui va la funcion)"
    );
  }, 60 * 5000);

  const onChangePassword = (
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
      window.location.reload();
      // } else {
      //   enqueueSnackbar(response.message, { variant: "error" });
      // }
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const onNotifications = (
    values: NotificationsFormValues,
    actions: FormikHelpers<NotificationsFormValues>
  ) => {
    actions.setSubmitting(true);
    alert(values.notifications);
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
              width: {
                lg: "40%",
                md: "100%",
              },
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
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    component={PasswordField}
                    name="newPassword"
                    label="Nueva contraseña"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Field
                    component={PasswordField}
                    name="newPasswordConfirmation"
                    label="Confirmar contraseña"
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
              width: {
                lg: "40%",
                md: "100%",
              },
            }}
          >
            <Formik
              initialValues={notificationsInitialValues}
              onSubmit={onNotifications}
              validationSchema={notificationsValidationSchema}
            >
              {({ isSubmitting }) => (
                <Stack>
                  <Field
                    component={RadioGroup}
                    name="notifications"
                    label="Recibir notificaciones"
                  >
                    <FormLabel
                      sx={{
                        my: 2,
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        color: "primary.main",
                      }}
                    >
                      ¿Desea recibir notificaciones de los espacios a los cuales
                      está suscrito?
                    </FormLabel>
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Si"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                    />
                  </Field>
                </Stack>
              )}
            </Formik>
          </Box>
          Aqui va todo lo de enviar invitacion a un usuario y luego lo de los
          permisos
        </Box>
      </Container>
    </Box>
  );
};

export default SettingsPage;
