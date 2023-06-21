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
import { Device } from "../../api/Device";
import { CloseRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface DeviceModalProps {
  isOpen: boolean;
  closeDialog: () => void;
  device: Device;
}

const DeviceModal = ({ isOpen, closeDialog, device }: DeviceModalProps) => {
  const navigate = useNavigate();

  let hasMetricsAndUnits = false;
  for (let i = 0; i < device.values.length; i++) {
    if (device.values[i].metricsAndUnits) {
      hasMetricsAndUnits = true;
    }
  }

  const handleDeleteDevice = () => {
    alert("Eliminando dispositivo");
  };

  const handleEditDevice = () => {
    navigate(`/devices/edit/${device.id}`);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isOpen}
      onClose={closeDialog}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: "8px",
        alignItems: "center",
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

      <DialogTitle
        fontWeight={"bold"}
        color="primary.main"
        sx={{ m: 0, py: 0 }}
      >
        {device.name}
      </DialogTitle>

      <Box>
        <DialogContent
          sx={{
            py: 0,
            m: 0,
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
              <Typography>{device.description}</Typography>
            </Box>
            <Box>
              <Typography fontWeight={"bold"}>Tópico:</Typography>
              <Typography>{device.currentTopic}</Typography>
            </Box>
            {hasMetricsAndUnits && (
              <Box>
                <Typography fontWeight={"bold"}>Métricas y unidades</Typography>
                <Typography>
                  <ul>
                    {device.values.map((value) => (
                      <>
                        {value.metricsAndUnits &&
                          value.metricsAndUnits.map((metricAndUnit) => (
                            <li>
                              {metricAndUnit.metric} - {metricAndUnit.unit}
                            </li>
                          ))}
                      </>
                    ))}
                  </ul>
                </Typography>
              </Box>
            )}

            <Box>
              <Typography fontWeight={"bold"}>
                Visualización de datos:
              </Typography>
              <Typography>
                <ul>
                  {device.dataVisualizationType.map((obj) => (
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
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={"bold"}>Creado por:</Typography>
              <Typography>{device.createdBy}</Typography>
            </Box>
            <Box>
              <Typography fontWeight={"bold"}>Creado el:</Typography>
              <Typography>{device.createdOn}</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Box>
      <Box
        sx={{
          alignSelf: "flex-end",
          m: 2,
        }}
      >
        <Button sx={{ mr: 2 }} onClick={handleDeleteDevice}>
          <Typography>Eliminar</Typography>
        </Button>
        <Button variant="contained" onClick={handleEditDevice}>
          <Typography>Editar</Typography>
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeviceModal;
