import { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import { DatePicker } from "formik-mui-lab";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { createPermission } from "../api/Permissions";
import { useUser } from "../contexts/authContext";
import { Space, getParentSpaces } from "../api/Space";

interface PermissionValues {
  email: string;
  spaceId: string;
  permission: string;
}
const initialValues = {
  email: "",
  spaceId: "",
  permission: "",
};
interface DialogProps {
  closeDialog: () => void;
  isOpen: boolean;
}

const PermissionValidationSchema = yup.object().shape({
  email: yup.string().required("Ingrese el correo por favor"),

  spaceId: yup.string().required("Seleccione el espacio por favor"),
  permission: yup.string().required("Seleccione el tipo de permiso por favor"),
});

const AddPermissionDialog = ({ closeDialog, isOpen }: DialogProps) => {
  const { user } = useUser();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    try {
      getParentSpaces(user?._id!, (allSpaces) => {
        setSpaces(allSpaces);
        console.log(allSpaces);
      });
    } catch (error) {}
  }, []);

  const onSubmit = async (
    { email, spaceId, permission }: PermissionValues,
    { setSubmitting }: FormikHelpers<PermissionValues>
  ) => {
    setSubmitting(true);
    const response = await createPermission(spaceId, permission, email);
    if (!response) {
      setSubmitting(false);
      return enqueueSnackbar("Hubo un error", { variant: "error" });
    }
    enqueueSnackbar("¡Registro exitoso!", { variant: "success" });
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={PermissionValidationSchema}
      >
        {() => (
          <Stack component={Form} spacing={2}>
            <DialogTitle>Crear permiso</DialogTitle>
            <DialogContent sx={{ maxWidth: "300pt" }}>
              <Field
                component={TextField}
                name="email"
                type="email"
                label="Email"
                required
              />

              <Field
                select
                component={TextField}
                label="Espacio"
                name="spaceId"
              >
                {spaces.map((space) => {
                  return (
                    <MenuItem key={space._id} value={space._id}>
                      {space.name}
                    </MenuItem>
                  );
                })}
              </Field>
              <FormControl
                sx={{
                  marginTop: "10pt",
                  marginBottom: "10pt",
                  width: "100%",
                }}
              >
                <FormLabel id="permission">Tipo de permiso</FormLabel>
                <Field
                  component={RadioGroup}
                  name="permission"
                  row
                  aria-labelledby="permiso"
                >
                  <FormControlLabel
                    value="read"
                    control={<Radio />}
                    label="Lectura"
                  />
                  <FormControlLabel
                    value="readWrite"
                    control={<Radio />}
                    label="Edición"
                  />
                </Field>
              </FormControl>
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
export default AddPermissionDialog;
