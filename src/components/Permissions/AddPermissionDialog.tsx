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
  Tooltip,
  IconButton,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import { DatePicker } from "formik-mui-lab";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { createPermission } from "../../api/Permissions";
import { useUser } from "../../contexts/authContext";
import { Space, getParentSpaces } from "../../api/Space";
import { CloseRounded } from "@mui/icons-material";

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
  //permission: yup.string().required("Seleccione el tipo de permiso por favor"),
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
  }, [user?._id]);

  const onSubmit = async (
    { email, spaceId, permission }: PermissionValues,
    { setSubmitting }: FormikHelpers<PermissionValues>
  ) => {
    if (spaceId === "") {
      return enqueueSnackbar("Seleccione un espacio", { variant: "error" });
    } else {
      setSubmitting(true);
      const response = await createPermission(spaceId, "readWrite", email);
      if (response?.success) {
        setSubmitting(false);
        enqueueSnackbar(response?.message, {
          variant: "success",
        });
        closeDialog();
        window.location.reload();
        return;
      }
      setSubmitting(false);
      return enqueueSnackbar(response?.message, { variant: "error" });
    }
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

      <DialogTitle>Crear permiso</DialogTitle>
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
                select
                component={TextField}
                label="Espacio"
                name="spaceId"
                sx={{ width: "280px", m: 0 }}
              >
                {spaces.map((space) => {
                  return (
                    <MenuItem key={space._id} value={space._id}>
                      {space.name}
                    </MenuItem>
                  );
                })}
              </Field>
              {/* <FormControl
                sx={{
                  marginTop: "10pt",
                  marginBottom: "10pt",
                  width: "280px",
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
              </FormControl> */}
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
