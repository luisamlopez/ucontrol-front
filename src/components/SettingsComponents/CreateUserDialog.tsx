import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  Dialog,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useUser } from "../../contexts/authContext";
import { CloseRounded } from "@mui/icons-material";
import { createUser } from "../../api/User";

interface PermissionValues {
  email: string;
  name: string;
}
const initialValues = {
  email: "",
  name: "",
};
interface DialogProps {
  closeDialog: () => void;
  isOpen: boolean;
}

const PermissionValidationSchema = yup.object().shape({
  email: yup.string().required("Ingrese el correo por favor"),

  name: yup.string().required("Ingrese el nombre, por favor"),
  //permission: yup.string().required("Seleccione el tipo de permiso por favor"),
});

const CreateUserDialog = ({ closeDialog, isOpen }: DialogProps) => {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (
    { email, name }: PermissionValues,
    { setSubmitting }: FormikHelpers<PermissionValues>
  ) => {
    setSubmitting(true);
    const response = await createUser(name, email);
    if (response) {
      setSubmitting(false);
      enqueueSnackbar(
        "Usuario invitado exitosamente, un correo fue enviado para notificarle.",
        {
          variant: "success",
        }
      );
      closeDialog();
      window.location.reload();
      return;
    }
    setSubmitting(false);
    return enqueueSnackbar("Hubo un error al invitar el usuario.", {
      variant: "error",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeDialog}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: "8px",
        alignItems: "center",
        justifyContent: "center",
        m: 2,
      }}
    >
      <Tooltip title="Cerrar">
        <IconButton
          onClick={closeDialog}
          sx={{
            alignSelf: "flex-end",
            mb: 0.5,
          }}
        >
          <CloseRounded />
        </IconButton>
      </Tooltip>

      <DialogTitle>Invitar un nuevo usuario</DialogTitle>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={PermissionValidationSchema}
      >
        {() => (
          <Stack component={Form} spacing={2}>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10pt",
                placeSelf: "center",
                width: "330px",
              }}
            >
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                required
                sx={{ width: "280px", m: 0 }}
              />
              <Field
                component={TextField}
                name="name"
                type="text"
                label="Nombre"
                required
                sx={{ width: "280px", m: 0 }}
              />
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={() => closeDialog()}>
                Cancelar
              </Button>
              <Button type="submit">Crear</Button>
            </DialogActions>
          </Stack>
        )}
      </Formik>
    </Dialog>
  );
};
export default CreateUserDialog;
