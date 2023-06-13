import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { useState } from "react";
import { KeyboardArrowDownRounded } from "@mui/icons-material";

interface HistoryProps {
  devices?: Device[];
  spaces?: Space[];
}

function DeviceDetails(device: Device) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Accordion
      expanded={expanded === device.id}
      onChange={handleChange(device.id)}
      sx={{ mr: 1 }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRounded />}
        id={`${device.id}-header`}
      >
        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {device.name}
        </Typography>
        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {device.history?.length === 0
            ? device.history[device.history?.length].updatedOn
            : device.createdOn}
        </Typography>

        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {device.history && device.history.length > 0
            ? device.history[device.history.length - 1].updatedBy
            : device.createdBy}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography mb={2} fontWeight={"bold"}>
          Historial de Cambios
        </Typography>
        {device && device.history && device.history.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {device.history.map((history) => (
              <Box
                sx={{
                  width: "90%",
                  borderBottom: "1px solid ",
                  borderColor: "secondary.main",
                  mb: 2,
                }}
              >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Fecha del cambio:
                  </Typography>
                  <Typography>{history.updatedOn}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Responsable del cambio:
                  </Typography>
                  <Typography>{history.updatedBy}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Nombre del dispositivo:
                  </Typography>
                  <Typography>{history.name}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Descripción:
                  </Typography>
                  <Typography>{history.description}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Tópico/Espacio:
                  </Typography>
                  <Typography>{history.topic}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Unidades y métricas:
                  </Typography>
                  <Typography mb={2}>
                    {history.metricsAndUnits
                      ?.map((obj) => `${obj.metric} - ${obj.unit}`)
                      .join(", ")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No hay historial de cambios</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

function SpaceDetails(device: Space) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Accordion
      expanded={expanded === device.id}
      onChange={handleChange(device.id)}
      sx={{ mr: 1 }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRounded />}
        id={`${device.id}-header`}
      >
        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {device.name}
        </Typography>
        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {device.history?.length === 0
            ? device.history[device.history?.length].updatedOn
            : device.createdOn}
        </Typography>

        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {device.history && device.history.length > 0
            ? device.history[device.history.length - 1].updatedBy
            : device.createdBy}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography mb={2} fontWeight={"bold"}>
          Historial de Cambios
        </Typography>
        {device && device.history && device.history.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {device.history.map((history) => (
              <Box
                sx={{
                  width: "90%",
                  borderBottom: "1px solid ",
                  borderColor: "secondary.main",
                  mb: 2,
                }}
              >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Fecha del cambio:
                  </Typography>
                  <Typography>{history.updatedOn}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Responsable del cambio:
                  </Typography>
                  <Typography>{history.updatedBy}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Nombre del dispositivo:
                  </Typography>
                  <Typography>{history.name}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Descripción:
                  </Typography>
                  <Typography>{history.description}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Ruta:
                  </Typography>
                  <Typography>{history.route}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Dispositivos:
                  </Typography>
                  <Typography mb={2}>
                    {device.devices && device.devices.length > 0
                      ? device.devices.map((device) => device.name).join(", ")
                      : "No hay dispositivos asociados"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No hay historial de cambios</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

const HistoryAccordion = ({ devices, spaces }: HistoryProps): JSX.Element => {
  return (
    <div>
      {devices && devices?.map((device) => <DeviceDetails {...device} />)}

      {spaces && spaces?.map((space) => <SpaceDetails {...space} />)}
    </div>
  );
};

export default HistoryAccordion;
