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
        Detalles del dispositivo
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
      {/* Mostrar un carusel con los gráficos */}
      {/* ToDo: ver como cambiar esto para que se renderice todo bien */}
      {/* <ChartCarousel children={chartComponents} /> */}
      {/* <PieChart data={chartData.data} id={chartData.id} />
      <BarChart data={chartData.data} id={chartData.id} /> */}
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

const SpaceDeviceDetails = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { spaceID } = useParams<{ spaceID: string }>();

  useEffect(() => {
    /* Buscar en la base de datos con el id del parametro del URL los dispositivos */
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevices: Device[] = [
          {
            id: "1",
            name: "Device 1",
            description: "Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",
            dataVisualizationType: ["pie", "bar"],
            history: [
              {
                name: "Device 1",
                description: "Description 1",
                topic: "Topic 1",
                dataVisualizationType: ["pie", "line"],
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                    value: 10,
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                    value: 10,
                  },
                ],
                updatedBy: "User 1.23",
                updatedOn: "2021-10-01",
              },
              {
                name: "Device 1.1",
                description: "Description 1.1",
                topic: "Topic 1.1",
                dataVisualizationType: ["pie", "gauge"],
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                    value: 20,
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                    value: 20,
                  },
                ],
                updatedBy: "User 1.5",
                updatedOn: "2021-10-01",
              },
            ],
            currentTopic: "Topic 1",
            metricsAndUnits: [
              {
                metric: "Metric 1",
                unit: "Unit 1",
                value: 12,
              },
              {
                metric: "Metric 2",
                unit: "Unit 2",
                value: 15,
              },
            ],
          },
          {
            id: "2",
            name: "Device 2",
            description: "Description 2",
            createdOn: "2021-10-01",
            createdBy: "User 2",
            currentTopic: "Topic 2",
            dataVisualizationType: ["pie", "bar"],
            metricsAndUnits: [
              {
                metric: "Metric 1",
                unit: "Unit 1",
                value: 12,
              },
              {
                metric: "Metric 2",
                unit: "Unit 2",
                value: 15,
              },
            ],
          },
          {
            id: "3",
            name: "Device 3",
            description: "Description 3",
            createdOn: "2021-10-01",
            createdBy: "User 3",
            currentTopic: "Topic 3",
            dataVisualizationType: ["pie"],
            metricsAndUnits: [
              {
                metric: "Metric 1",
                unit: "Unit 1",
                value: 12,
              },
              {
                metric: "Metric 2",
                unit: "Unit 2",
                value: 15,
              },
            ],
          },
        ];

        setDevices(dataDevices);

        setDataLoaded(true);
      }, 1000);
    };

    try {
      fetchData();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0, width: "100%" }}>
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
          >
            Dispositivos del espacio {spaceID} (buscar en BD)
          </Typography>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : !dataLoaded ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : devices.length === 0 ? (
            <Typography
              color="primary"
              textAlign="left"
              fontSize={{ xs: 16, sm: 24, lg: 24 }}
              fontWeight={600}
              p={0}
              mt={{ xs: 6, sm: 0, lg: 0 }}
              mb={2}
            >
              Error: no se pudieron cargar los dispositivos.
            </Typography>
          ) : (
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
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SpaceDeviceDetails;
