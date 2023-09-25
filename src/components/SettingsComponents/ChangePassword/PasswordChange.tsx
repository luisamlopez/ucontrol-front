import { LoadingButton } from "@mui/lab";
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";
import { FormikHelpers, Formik, Field, Form } from "formik";
import PasswordField from "../../Fields/PasswordField";
import * as yup from "yup";
import { useUser } from "../../../contexts/authContext";
import { useSnackbar } from "notistack";
import { changePassword } from "../../../api/User";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

const initialFormValues = {
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

const PasswordChange = (): JSX.Element => {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useUser();

  const onChangePassword = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    console.log(values);

    try {
      actions.setSubmitting(true);

      const response = await changePassword(
        user?._id!,
        values.oldPassword,
        values.newPassword
      );
      if (response.success) {
        enqueueSnackbar(response.message, { variant: "success" });
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
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
        initialValues={initialFormValues}
        onSubmit={onChangePassword}
        validationSchema={CPValidationSchema}
      >
        {({ isSubmitting }) => (
          <Stack component={Form} spacing={2}>
            <Field
              component={PasswordField}
              name="oldPassword"
              label="Contraseña actual"
              variant="outlined"
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
  );
};
export default PasswordChange;
