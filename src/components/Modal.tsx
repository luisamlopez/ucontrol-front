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
import { Device } from "../api/Device";
import { CloseRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Space } from "../api/Space";

interface DeviceModalProps {
  isOpen: boolean;
  closeDialog: () => void;
  device?: Device;
  space?: Space;
}

const Modal = (props: DeviceModalProps) => {
  const navigate = useNavigate();

  let hasMetricsAndUnits = false;
  if (props.device) {
    // for (let i = 0; i < props.device.values.length; i++) {
    //   if (props.device.values[i].metricsAndUnits) {
    //     hasMetricsAndUnits = true;
    //   }
    // }
  }

  const handleDeleteDevice = () => {
    alert("Eliminando dispositivo");
  };

  const handleEditDevice = () => {
    navigate(`/devices/edit/${props.device!.id}`);
  };

  const handleDeleteSpace = () => {
    alert("Eliminando espacio");
  };

  const handleEditSpace = () => {
    navigate(`/spaces/edit/${props.space!.id}`);
  };

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
                <Typography fontWeight={"bold"}>Tópico:</Typography>
                <Typography>{props.device.topic}</Typography>
              </Box>
            )}

            {props.space && (
              <Box>
                <Typography fontWeight={"bold"}>Dispositivos:</Typography>
                <Typography>
                  {props.space.devices && (
                    <ul>
                      {props.space.devices.map((device) => (
                        <li>{device.name}</li>
                      ))}
                    </ul>
                  )}
                  {!props.space.devices && (
                    <>No hay dispositivos en este espacio.</>
                  )}
                </Typography>
              </Box>
            )}

            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>
                  Métricas y unidades:
                </Typography>
                <Typography>
                  {/* <ul>
                    {props.device.values.map((value) => (
                      <>
                        {value.metricsAndUnits &&
                          value.metricsAndUnits.map((metricAndUnit) => (
                            <li>
                              {metricAndUnit.metric} - {metricAndUnit.unit}
                            </li>
                          ))}
                      </>
                    ))}
                  </ul> */}
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
                      {props.device.dvt.map((obj) => (
                        <li>
                          {obj === "pie"
                            ? "Gráfico de pastel"
                            : obj === "bar"
                            ? "Gráfico de barras"
                            : obj === "line"
                            ? "Gráfico de líneas"
                            : "Gauge"}
                        </li>
                      ))}
                    </ul>
                  )}
                </Typography>
              </Box>
            )}
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>Creado por:</Typography>
                <Typography>{props.device.createdBy}</Typography>
              </Box>
            )}
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>Creado por:</Typography>
                <Typography>{props.device.createdBy}</Typography>
              </Box>
            )}
            {props.device && (
              <Box>
                <Typography fontWeight={"bold"}>Creado el:</Typography>
                <Typography>{props.device.createdOn.toString()}</Typography>
              </Box>
            )}

            {props.space && (
              <Box>
                <Typography fontWeight={"bold"}>Ubicación:</Typography>
                <Typography>
                  {props.space.parentSpace
                    ? props.space.parentSpace.name
                    : props.space.subSpaces
                    ? props.space.subSpaces.flatMap((obj) => obj.name).join("/")
                    : "No hay ubicación"}
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
      </Box>
    </Dialog>
  );
};

export default Modal;
