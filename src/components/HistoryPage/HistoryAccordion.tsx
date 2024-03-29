import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Device } from "../../api/Device";
import { Space } from "../../api/Space";
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
      expanded={expanded === device._id}
      onChange={handleChange(device._id!)}
      sx={{ mr: 1 }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRounded />}
        id={`${device._id}-header`}
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
            ? new Date(
                device.history[device.history?.length].updatedOn
              ).toLocaleString("es-VE", {
                hour12: false,
                dateStyle: "short",
                timeStyle: "short",
              })
            : new Date(device.createdOn!).toLocaleString("es-VE", {
                hour12: false,
                dateStyle: "short",
                timeStyle: "short",
              })}
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
            {device.history.map((history, i) => (
              <Box
                sx={{
                  width: "90%",
                  borderBottom: "1px solid ",
                  borderColor: "secondary.main",
                  mb: 2,
                }}
                key={i}
              >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Fecha del cambio:
                  </Typography>
                  <Typography>
                    {new Date(history.updatedOn).toLocaleString("es-VE", {
                      hour12: false,
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Responsable del cambio:
                  </Typography>
                  <Typography>{history.updatedBy}</Typography>
                </Box>

                <Box display={"flex"} justifyContent={"space-between"}>
                  <Typography color={"primary.main"} fontWeight={"medium"}>
                    Descripción del cambio:
                  </Typography>
                  <Typography>
                    {history.field[history.field.length - 1]}
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

function SpaceDetails(space: Space) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Accordion
      expanded={expanded === space._id}
      onChange={handleChange(space._id!)}
      sx={{ mr: 1 }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRounded />}
        id={`${space._id}-header`}
      >
        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {space.name}
        </Typography>
        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {/* {space.history?.length === 0
            ? formattedUpdatedOn
            : formattedCreatedOn} */}
        </Typography>

        <Typography
          sx={{
            width: "33%",
            flexShrink: 0,
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          {space.history && space.history.length > 0
            ? space.history[space.history.length - 1].updatedBy
            : space.createdBy}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography mb={2} fontWeight={"bold"}>
          Historial de Cambios
        </Typography>
        {space && space.history && space.history.length > 0 ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {space.history.map((history) => (
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
                  <Typography>
                    {new Date(history.updatedOn).toLocaleString("es-VE", {
                      hour12: false,
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Typography>
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
                  <Typography>
                    {history.field.flatMap((obj) => obj).join("---")}
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
      {devices &&
        devices?.map((device, i) => <DeviceDetails key={i} {...device} />)}

      {spaces && spaces?.map((space, i) => <SpaceDetails key={i} {...space} />)}
    </div>
  );
};

export default HistoryAccordion;
