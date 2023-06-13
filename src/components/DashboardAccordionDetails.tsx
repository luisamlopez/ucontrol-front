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
import { EmojiObjectsRounded, WarningRounded } from "@mui/icons-material";

export interface Details {
  devices: Device[];
}

function DevicesDetails(devices: Device[]) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        width: "30%",
      }}
    >
      <Typography
        fontWeight={"bold"}
        textAlign={"left"}
        fontSize={{ xs: 18, sm: 24, lg: 24 }}
        color={"primary.main"}
      >
        Dispositivos conectados
      </Typography>

      {devices ? (
        // devices.map((device) => (
        //   <ul>
        //     <li>
        //       <Typography textAlign={"left"}>{device.name}</Typography>
        //     </li>
        //   </ul>
        // ))
        <></>
      ) : (
        <Typography textAlign={"left"}>
          No hay dispositivos en este espacio
        </Typography>
      )}
    </Box>
  );
}

function Summary(devices: Device[]) {
  //Get array of the units of each device and another of the values of each device

  let values: MetricAndUnit[] = [];

  //   devices.map((device) => {
  //     for (let metric of device.metricsAndUnits) {
  //       values.push(metric);
  //     }
  //   });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        width: "70%",
      }}
    >
      <Typography
        fontWeight={"bold"}
        textAlign={"left"}
        fontSize={{ xs: 18, sm: 24, lg: 24 }}
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
            justifyContent: "space-between",
          }}
        >
          <Box>
            <WarningRounded sx={{ fontSize: 100 }} color="warning" />

            <Typography>Alerta de consumo</Typography>
          </Box>

          <Box>
            <EmojiObjectsRounded sx={{ fontSize: 100 }} color="secondary" />
            <Typography>Recomendación</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const DashboardAccordionDetails = ({ devices }: Details): JSX.Element => {
  console.log("dispositivos: " + devices);

  return (
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
      }}
    >
      <DevicesDetails {...devices} />
      <Summary {...devices} />
    </Box>
  );
};

export default DashboardAccordionDetails;
