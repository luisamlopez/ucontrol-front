import { Box, Typography } from "@mui/material";
import { Device } from "../../api/Device";
import DevicesDetailsText from "../DeviceDetailsText";
import ChartCarousel from "../Charts/ChartCarousel";
import { format } from "date-fns";

interface Props {
  devices: Device[];
}

/**
 *
 * @param props recibe un dispositivo
 * @returns  un componente con los detalles del dispositivo
 */
function Details(props: { device: Device }): JSX.Element {
  // Verifica y convierte la propiedad 'createdOn' a tipo Date
  let modifiedDevice = { ...props.device }; // Crea un nuevo objeto a partir del objeto original
  if (modifiedDevice.createdOn && !(modifiedDevice.createdOn instanceof Date)) {
    modifiedDevice.createdOn = new Date(modifiedDevice.createdOn);
  }

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
        title={"Descripcion"}
        value={props.device.description}
      />

      <DevicesDetailsText
        title={"Conectado desde el"}
        value={new Date(props.device.createdOn!).toLocaleString("es-VE", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })}
      />

      <DevicesDetailsText title="Tópico" value={props.device.topic!} />

      <DevicesDetailsText
        title={"Instrucciones"}
        value={"props.device.instructions"}
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
  // let chartData: ChartDataProps = {
  //   _id: props.device._id,
  //   data: [],
  // };

  // props.device.metricsAndUnits.forEach((metric) => {
  //   chartData.data.push({
  //     argument: metric.metric,
  //     value: metric.value,
  //   });
  // });

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
              {device.name}
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
            <Details device={device} />
            {(device.type === "luz" || device.type === "aire") && <>switch</>}
            <Graph device={device} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SpaceDeviceDetails;
