import {
  ACSpace,
  Space,
  getAccessControlSpace,
  updateStatusSpace,
} from "../../api/Space";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import DevicesDetailsText from "../DeviceDetailsText";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, getUserById } from "../../api/User";
import { useSnackbar } from "notistack";

const ACCard = (space: Space): JSX.Element => {
  const [devices, setDevices] = useState<ACSpace>();
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // Verifica y convierte la propiedad 'createdOn' a tipo Date

  useEffect(() => {
    const fetch = async () => {
      if (space.devices && space.devices.length > 0) {
        try {
          for (let i = 0; i < space.devices.length; i++) {
            await getAccessControlSpace(space.devices[i], (dev) => {
              setDevices(dev);
            });
          }
          await getUserById(space.createdBy, (user) => {
            setUser(user);
          });
          space.createdBy = user?.name!;
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetch();
  }, [space, space.devices, user?.name]);

  const handleActivate = async () => {
    try {
      const response = await updateStatusSpace(devices?.deviceId!, true);
      if (response) {
        enqueueSnackbar("Espacio activado", { variant: "success" });
        window.location.reload();
      } else {
        enqueueSnackbar(
          "Error al activar el espacio, este ya se encuentra activo",
          { variant: "error" }
        );
      }
    } catch (error) {}
  };

  const handleDeactivate = async () => {
    try {
      const response = await updateStatusSpace(devices?.deviceId!, false);
      if (response) {
        enqueueSnackbar("Espacio desactivado", { variant: "success" });
        window.location.reload();
      } else {
        enqueueSnackbar(
          "Error al desactivar el espacio, este ya se encuentra desactivo",
          { variant: "error" }
        );
      }
    } catch (error) {}
  };
  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          backgroundColor: "#ECEEEF",
          borderRadius: "8px",
          height: "100%",
          p: 1,
          width: "100%",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: "calc(100% - 64px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "wrap",
            minWidth: "100%",
            wordBreak: "break-word",
            gap: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "column",
                md: "row",
                lg: "row",
              },
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontSize="1.2rem"
              fontWeight={"bold"}
              color={"primary.main"}
              mb={1}
              sx={{
                width: "90%",
                minHeight: { xs: "50px", sm: "50px", md: "50px", lg: "auto" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
                wordBreak: "break-word",
              }}
            >
              {space.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                },
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "5px",
              }}
            >
              <Button
                fullWidth
                onClick={() => {
                  handleActivate();
                }}
                variant="contained"
              >
                <Typography textTransform={"none"}>
                  Activar acceso al espacio
                </Typography>
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  handleDeactivate();
                }}
              >
                <Typography textTransform={"none"}>
                  Desactivar acceso al espacio
                </Typography>
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              minHeight: "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              wordBreak: "break-word",
              minWidth: "100%",
            }}
          >
            <DevicesDetailsText
              title="Estado"
              value={devices?.status ? "Activo" : "Inactivo"}
            />

            {/* <Typography fontWeight={"bold"} color={"primary.main"}>
              Estado: {devices.status ? "Activo" : "Inactivo"}
            </Typography> */}

            {devices?.description && (
              <Box
                sx={{
                  minHeight: "auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                  wordBreak: "break-word",
                  minWidth: "100%",
                }}
              >
                <DevicesDetailsText
                  title="Descripción"
                  value={devices.description!}
                />
              </Box>
            )}

            <DevicesDetailsText
              title="Creado el"
              value={new Date(devices?.createdOn!).toLocaleString("VET", {
                hour12: false,
                dateStyle: "short",
                timeStyle: "short",
              })}
            />
            <DevicesDetailsText title="Creado por" value={user?.name!} />
          </Box>
        </CardContent>
        <CardActions
          sx={{
            alignSelf: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              navigate(`/controlAccess/${devices?.deviceId!}`);
            }}
          >
            <Typography fontSize={18} color={"primary.main"} fontWeight="bold">
              Ver más
            </Typography>
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ACCard;
