import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Device, MetricAndUnit } from "../api/Device";
import { Space } from "../api/Space";
import { useState } from "react";
import {
  EmojiObjectsRounded,
  KeyboardArrowDownRounded,
  WarningRounded,
} from "@mui/icons-material";

export interface AccordionProps {
  spaces: Space[];
}

function DevicesDetails({ devices }: { devices: Device[] }): JSX.Element {
  console.log(devices);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        width: {
          lg: "25%",
          md: "25%",
          xs: "100%",
          sm: "100%",
        },
        borderRadius: "4px",
        p: 1,
        mr: {
          lg: 2,
          md: 2,
        },
        mb: {
          lg: 0,
          md: 0,
          xs: 2,
          sm: 2,
        },
      }}
    >
      <Typography
        fontWeight={"bold"}
        textAlign={"left"}
        fontSize={{ xs: 14, sm: 18, lg: 18 }}
        color={"primary.main"}
      >
        Dispositivos conectados
      </Typography>

      {devices ? (
        devices.map((device) => (
          <ul>
            <li>
              <Typography textAlign={"left"}>{device.name}</Typography>
            </li>
          </ul>
        ))
      ) : (
        <Typography textAlign={"left"}>
          No hay dispositivos en este espacio
        </Typography>
      )}
    </Box>
  );
}

function Summary({ devices }: { devices: Device[] }): JSX.Element {
  //Get array of the units of each device and another of the values of each device

  let values: MetricAndUnit[] = [];

  devices.map((device) => {
    for (let metric of device.metricsAndUnits) {
      values.push(metric);
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        width: {
          lg: "70%",
          md: "70%",
          xs: "100%",
          sm: "100%",
        },
        borderRadius: "4px",
        p: 1,
      }}
    >
      <Typography
        fontWeight={"bold"}
        textAlign={"left"}
        fontSize={{ xs: 14, sm: 18, lg: 18 }}
        color={"primary.main"}
      >
        Resumen de actividad
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            lg: "row",
            md: "row",
            xs: "column",
            sm: "column",
          },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <ul>
            {values.map((value) => (
              <li>
                <Typography textAlign={"left"}>
                  {value.metric} actual: {value.value} {value.unit}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <WarningRounded sx={{ fontSize: 30 }} color="warning" />

            <Typography>Alerta de consumo</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <EmojiObjectsRounded sx={{ fontSize: 30 }} color="secondary" />
            <Typography>Recomendación</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const DashboardAccordion = ({ spaces }: AccordionProps): JSX.Element => {
  return (
    <>
      {spaces.map((space, i) => (
        <Accordion
          sx={{
            backgroundColor: "#ECEEEF",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
          key={i}
        >
          <AccordionSummary expandIcon={<KeyboardArrowDownRounded />}>
            <Typography
              fontWeight={"bold"}
              textAlign={"left"}
              fontSize={{ xs: 14, sm: 18, lg: 18 }}
            >
              {space.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {space.devices ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    lg: "row",
                    md: "row",
                    xs: "column",
                    sm: "column",
                  },
                  width: "100%",
                  borderRadius: "4px",
                  p: 1,
                  justifyContent: "space-between",
                }}
              >
                <DevicesDetails devices={space.devices} />
                <Summary devices={space.devices} />
              </Box>
            ) : (
              <Typography> No hay dispositivos en este espacio</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default DashboardAccordion;
