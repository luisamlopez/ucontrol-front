import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Device, deleteDevice, getSpaceFromDeviceId } from "../api/Device";
import { CloseRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Space, deleteSpace, getSpaceById } from "../api/Space";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/authContext";
import { useSnackbar } from "notistack";
import { User, getUserById } from "../api/User";

interface DeviceModalProps {
  isOpen: boolean;
  closeDialog: () => void;
  device?: Device;
  space?: Space;
  spaceDevices?: Device[];
}

const Modal = (props: DeviceModalProps) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useUser();
  const [userId, setUser] = useState<User>();
  const [spaceId, setSpaceId] = useState<string>("");
  const routeRef = useRef<string>(""); // Create a ref to store the route value

  let modifiedDevice: Device; // Crea un nuevo objeto a partir del objeto original
  let modifiedSpace: Space;

  if (props.device) {
    modifiedDevice = { ...props.device };
    if (props.device.createdOn && !(props.device.createdOn instanceof Date)) {
      modifiedDevice.createdOn = new Date(props.device.createdOn);
    }
  } else if (props.space) {
    modifiedSpace = { ...props.space };
    if (props.space.createdOn && !(props.space.createdOn instanceof Date)) {
      modifiedSpace.createdOn = new Date(props.space.createdOn);
    }
  }

  const handleDeleteDevice = async () => {
    try {
      if (await deleteDevice(props.device!._id!)) {
        enqueueSnackbar("Dispositivo eliminado", { variant: "success" });
        window.location.reload();
      } else {
        enqueueSnackbar("Error al eliminar el dispositivo", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al eliminar el dispositivo", { variant: "error" });
    }
  };

  const handleEditDevice = () => {
    navigate(`/devices/edit/${props.device!._id}`);
  };

  const handleDeleteSpace = async () => {
    try {
      if (await deleteSpace(props.space!._id!)) {
        enqueueSnackbar("Espacio eliminado", { variant: "success" });
        window.location.reload();
      } else {
        enqueueSnackbar("Error al eliminar el espacio", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al eliminar el espacio", {
        variant: "error",
      });
    }
  };

  const handleEditSpace = () => {
    navigate(`/spaces/edit/${props.space!._id}`);
  };

  useEffect(() => {
    try {
      getUserById(
        props.device ? props.device?.createdBy! : props.space?.createdBy!,
        (user) => {
          setUser(user);
        }
      );
    } catch (error) {}
  }, [props.device, props.space?.createdBy]);

  useEffect(() => {
    if (props.device) {
      try {
        getSpaceFromDeviceId(props.device._id!, (space) => {
          setSpaceId(space);
        });
      } catch (error) {}
    }
  }, [props.device]);

  useEffect(() => {
    if (props.device) {
      if (spaceId) {
        getSpaceById(spaceId, (space: Space) => {
          routeRef.current = space.name;
        });
      }
    }
    // console.log("no");
  }, [props.device, spaceId]);

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.closeDialog}
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
          onClick={props.closeDialog}
          sx={{
            alignSelf: "flex-end",
            mb: 0.5,
          }}
        >
          <CloseRounded />
        </IconButton>
      </Tooltip>

      <DialogTitle
        fontWeight={"bold"}
        color="primary.main"
        sx={{ m: 0, py: 0 }}
      >
        {props.device && props.device.name}

        {props.space && props.space.name}
      </DialogTitle>

      <Box>
        <DialogContent
          sx={{
            py: 0,
            m: 0,
            width: {
              xs: "320px",
              lg: "580px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Box>
              <Typography fontWeight={"bold"}>Descripción:</Typography>
              {props.device && (
                <Typography>{props.device.description}</Typography>
              )}

              {props.space && (
                <Typography>{props.space.description}</Typography>
              )}
            </Box>
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>
                  Tipo de dispositivo:
                </Typography>
                <Typography>
                  {props.device.type === "tempHum"
                    ? "Sensor de temperatura y humedad del aire"
                    : props.device.type === "hum"
                    ? "Sensor de humedad de tierra"
                    : props.device.type === "luz"
                    ? "Control de luminaria"
                    : props.device.type === "movimiento"
                    ? "Sensor de movimiento"
                    : props.device.type === "vibraciones"
                    ? "Sensor de vibraciones"
                    : props.device.type === "controlAcceso"
                    ? "Control de acceso"
                    : props.device.type === "aire"
                    ? "Control de aire acondicionado"
                    : "Flujo de agua"}
                </Typography>
              </Box>
            )}
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>Ubicación:</Typography>
                <Typography>{routeRef.current}</Typography>
              </Box>
            )}
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>Tópico:</Typography>
                <Typography>{props.device.topic!}</Typography>
              </Box>
            )}
            {props.space && (
              <Box>
                <Typography fontWeight={"bold"}>Dispositivos:</Typography>
                <Typography>
                  {props.spaceDevices && (
                    <ul>
                      {props.spaceDevices.map((device, i) => (
                        <li key={i}>{device.name}</li>
                      ))}
                    </ul>
                  )}
                  {!props.spaceDevices && (
                    <>No hay dispositivos en este espacio.</>
                  )}
                </Typography>
              </Box>
            )}
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>
                  Visualización de datos:
                </Typography>
                <Typography>
                  {props.device && (
                    <ul>
                      {props.device.dvt.map((obj, i) => (
                        <li key={i}>
                          {obj === "pie"
                            ? "Gráfico de pastel"
                            : obj === "bar"
                            ? "Gráfico de barras"
                            : obj === "line"
                            ? "Gráfico de líneas"
                            : obj === "gauge"
                            ? "Gauge"
                            : obj === "value"
                            ? "Solo valor"
                            : obj === "table"
                            ? "Tabla"
                            : "Diagrama de dispersión"}
                        </li>
                      ))}
                    </ul>
                  )}
                </Typography>
              </Box>
            )}
            <Box>
              <Typography fontWeight={"bold"}>Creado por:</Typography>
              <Typography>{userId?.name!}</Typography>
            </Box>
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>Creado el:</Typography>
                <Typography>
                  {format(modifiedDevice!.createdOn!, "dd/mm/yyyy")}
                </Typography>
              </Box>
            )}
            {props.space && (
              <Box>
                <Typography fontWeight={"bold"}>Ubicación:</Typography>
                <Typography>
                  {props.space.parentSpace
                    ? props.space.parentSpace
                    : props.space.subSpaces
                    ? props.space.subSpaces.flatMap((obj) => obj).join("/")
                    : "No hay ubicación"}
                </Typography>
              </Box>
            )}
            {props.space && (
              <Box>
                <Typography fontWeight={"bold"}>Creado el:</Typography>
                <Typography>
                  {format(modifiedSpace!.createdOn!, "dd/mm/yyyy")}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Box>
      <Box
        sx={{
          alignSelf: "flex-end",
          m: 2,
          p: 2,
        }}
      >
        <Button
          sx={{ mr: 2 }}
          onClick={() => {
            if (props.device) {
              handleDeleteDevice();
            } else if (props.space) {
              handleDeleteSpace();
            }
          }}
        >
          <Typography>Eliminar</Typography>
        </Button>
        {user?.admin && (
          <Button
            variant="contained"
            onClick={() => {
              if (props.device) {
                handleEditDevice();
              } else if (props.space) {
                handleEditSpace();
              }
            }}
          >
            <Typography>Editar</Typography>
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default Modal;
