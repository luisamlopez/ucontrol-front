import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
  FormControlLabel,
  FormLabel,
  Radio,
} from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../contexts/authContext";
import { Field, Formik, FormikHelpers } from "formik";
import { RadioGroup } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AddPermissionDialog from "../components/SettingsComponents/Permissions/AddPermissionDialog";
import PermissionsTable from "../components/SettingsComponents/Permissions/PermissionsTable";
import { PermissionInfo } from "../api/Permissions";
import { getUserPermissions } from "../api/Permissions";
import PermissionsMobile from "../components/SettingsComponents/Permissions/PermissionsMobile";
import PasswordChange from "../components/SettingsComponents/ChangePassword/PasswordChange";

interface NotificationsFormValues {
  notifications: boolean;
}

const SettingsPage = (): JSX.Element => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState<PermissionInfo[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const notificationsInitialValues = {
    notifications: true,
  };

  const notificationsValidationSchema = yup.object().shape({
    notifications: yup.boolean().required("Seleccione una opción, por favor"),
  });

  // useAutosave(() => {
  //   alert(
  //     "Se ha guardado su configuración de notificaciones (aqui va la funcion)"
  //   );
  // }, 60 * 1000);

  const onChangeNotifications = (
    values: NotificationsFormValues,
    actions: FormikHelpers<NotificationsFormValues>
  ) => {
    actions.setSubmitting(true);
    alert(values.notifications);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserPermissions(user?._id!, (permissions) => {
          setData(permissions);
        });
      } catch (error) {}
    };
    fetch();
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            sx={{
              wordWrap: "break-word",
            }}
          >
            Configuración
          </Typography>
          <PasswordChange />
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
              onSubmit={onChangeNotifications}
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
          {user?.admin && (
            <Box>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 500,
                }}
              >
                Lista de permisos autorizados
              </Typography>

              {/* Button to open the permission dialog */}
              <Button
                variant="outlined"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Crear permiso
              </Button>

              {windowWidth > 960 && <PermissionsTable data={data} />}
              {windowWidth <= 960 && (
                <>
                  {data.map((d) => (
                    <PermissionsMobile data={d} key={d.id} />
                  ))}
                </>
              )}
              <AddPermissionDialog
                closeDialog={() => {
                  setIsOpen(false);
                }}
                isOpen={isOpen}
              ></AddPermissionDialog>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SettingsPage;
