import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Container,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import DevicesDetailsText from "./DeviceDetailsText";
import BarChart from "./Charts/BarChart";
import PieChart from "./Charts/PieChart";
import { ChartData } from "../api/ChartData";
import ChartCarousel from "./ChartCarousel";

/**
 *
 * @param props recibe un dispositivo
 * @returns  un componente con los detalles del dispositivo
 */
function Details(props: { device: Device }): JSX.Element {
  const types = props.device.dataVisualizationType;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: {
          lg: "30%",
          md: "30%",
          xs: "100%",
          sm: "100%",
        },
        backgroundColor: "white",
        p: 1,
        mt: 1,
        borderRadius: "4px",
      }}
    >
      <Typography fontWeight={"bold"} textAlign={"left"} color={"primary.main"}>
        Detalles del dispositivo {types.flatMap((type) => type)}
      </Typography>

      <DevicesDetailsText
        title={"Descripcion: "}
        value={props.device.description}
      />

      <DevicesDetailsText
        title={"Conectado desde el: "}
        value={props.device.createdOn}
      />

      <DevicesDetailsText title="Tópico: " value={props.device.currentTopic} />

      <DevicesDetailsText
        title={"Instrucciones: "}
        value={
          "props.device.instructions Pasadas las 6 pm enviar notificaciones si se detectan movimientos."
        }
      />
    </Box>
  );
}

/**
 *
 * @param props recibe un dispositivo para mostrar su grafica
 * @returns  un componente que muestra la grafica de un dispositivo
 */

function Graph(props: { device: Device }): JSX.Element {
  let chartData: ChartData = {
    id: props.device.id,
    data: [],
  };

  props.device.metricsAndUnits.forEach((metric) => {
    chartData.data.push({
      argument: metric.metric,
      value: metric.value,
    });
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: {
          lg: "70%",
          md: "70%",
          xs: "100%",
          sm: "100%",
        },
        backgroundColor: "white",
        p: 1,
        mt: 1,
        ml: 1,
        borderRadius: "4px",
      }}
    >
      <ChartCarousel device={props.device} />
    </Box>
  );
}

/**
 *
 * @param props recibe un dispositivo para mostrar sus detalles
 * @returns  un componente que muestra los detalles de un dispositivo: nombre, descripcion, fecha de creacion, topico y instrucciones con su grupo de gráficos
 */
function DeviceDetails(props: { device: Device }): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "#ECEEEF",
        borderRadius: "8px",
        p: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontWeight={"bold"}
          textAlign={"left"}
          fontSize={{ xs: 14, sm: 18, lg: 18 }}
        >
          {props.device.name}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Details device={props.device} />
        <Graph device={props.device} />
      </Box>
    </Box>
  );
}

interface Props {
  devices: Device[];
}

const SpaceDeviceDetails = ({ devices }: Props): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        mb: 5,
      }}
    >
      {devices.map((device, index) => (
        <DeviceDetails device={device} key={index} />
      ))}
    </Box>
  );
};

export default SpaceDeviceDetails;
