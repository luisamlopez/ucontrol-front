import { Box, Typography } from "@mui/material";
import { Device } from "../../api/Device";
import DevicesDetailsText from "../DeviceDetailsText";
import ChartCarousel from "../Charts/ChartCarousel";

interface Props {
  devices: Device[];
}

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
      {props.device.description && (
        <DevicesDetailsText
          title={"Descripcion"}
          value={props.device.description}
        />
      )}
      <DevicesDetailsText
        title={"Conectado desde el"}
        value={new Date(props.device.createdOn!).toLocaleString("es-VE", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })}
      />
      <DevicesDetailsText
        title={"Tipo de dispositivo"}
        value={
          props.device.type === "tempHum"
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
            : "Flujo de agua"
        }
      />
      <DevicesDetailsText title="Tópico" value={props.device.topic!} />
      {props.device.conditions && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Typography
            fontWeight={"bold"}
            textAlign={"left"}
            color={"primary.main"}
          >
            Condiciones del dispositivo
          </Typography>
          <Typography>
            Este dispositivo tiene una condición asociada al tópico "
            {props.device.conditions.listenerDevice}" y{" "}
            {props.device.conditions.instruction === "1"
              ? "se enciende"
              : "se apaga"}{" "}
            cuando detecta{" "}
            {props.device?.conditions?.condition === "1" ||
            props.device?.conditions?.condition === "0"
              ? "o no presencia"
              : props.device?.conditions?.condition}{" "}
            {props.device?.conditions?.conditionValue
              ? props.device?.conditions?.conditionValue
              : ""}
            {props.device.conditions.listenerDevice?.includes("Temperatura")
              ? "°C"
              : props.device.conditions.listenerDevice?.includes("Humedad")
              ? "%"
              : ""}
            .
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/**
 *
 * @param props recibe un dispositivo para mostrar su grafica
 * @returns  un componente que muestra la grafica de un dispositivo
 */

function Graph(props: { device: Device }): JSX.Element {
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
        ml: {
          lg: 1,
          md: 1,
          sm: 0,
          xs: 0,
        },
        borderRadius: "4px",
        height: "32rem",
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
        <Box key={index} m={0} p={0}>
          {device.type === "controlAcceso" && (
            <Typography
              fontWeight={"bold"}
              textAlign={"left"}
              color={"primary.main"}
              mb={2}
            >
              Por ser "{device.name}" un dispositivo de control de acceso, no se
              muestra en este módulo, por favor diríjase a la sección de
              "Control de Acceso" para ver sus valores.
            </Typography>
          )}
          {device.type !== "controlAcceso" && (
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
              key={index}
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

                <Graph device={device} />
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default SpaceDeviceDetails;
