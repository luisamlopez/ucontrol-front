import { Device, getSpaceFromDeviceId } from "../../api/Device";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import DevicesDetailsText from "../DeviceDetailsText";
import Modal from "../Modal";
import { useEffect, useRef, useState } from "react";
import { User, getUserById } from "../../api/User";
import { Space, getSpaceById } from "../../api/Space";

const DeviceCard = (device: Device): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const [spaceId, setSpaceId] = useState<string>("");

  const routeRef = useRef<string>(""); // Create a ref to store the route value

  useEffect(() => {
    try {
      getUserById(device.createdBy, (user) => {
        setUser(user);
      });
      device.createdBy = user?.name!;
    } catch (error) {}
  }, [device, user?.name]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    try {
      getSpaceFromDeviceId(device._id!, (space) => {
        setSpaceId(space);
      });
    } catch (error) {}
  }, [device._id]);

  useEffect(() => {
    if (spaceId) {
      getSpaceById(spaceId, (space: Space) => {
        routeRef.current = space.name;
      });
    }
    // console.log("no");
  }, [spaceId]);

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          backgroundColor: "#ECEEEF",
          borderRadius: "8px",
          height: {
            xs: "380px",
            sm: "380px",
            md: "460px",
            lg: "460px",
          },
          p: 1,
          width: "100%",
          maxWidth: {
            lg: "550px",
            md: "500px",
            sm: "300px",
            xs: "300px",
          },
          m: " 0 auto",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: "calc(100% - 64px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "wrap",
            minWidth: "100%",
            wordBreak: "break-word",
            gap: "5px",
          }}
        >
          <Typography
            fontSize={{
              xs: "1rem",
              sm: "1rem",
              md: "1.2rem",
              lg: "1.2rem",
            }}
            fontWeight={"bold"}
            color={"primary.main"}
            mb={1}
            sx={{
              minHeight: "50px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              wordBreak: "break-word",
              minWidth: "100%",
            }}
          >
            {device.name}
          </Typography>
          <DevicesDetailsText
            title="Tipo de dispositivo"
            value={
              device.type === "tempHum"
                ? "Sensor de temperatura y humedad del aire"
                : device.type === "hum"
                ? "Sensor de humedad de tierra"
                : device.type === "luz"
                ? "Control de luminaria"
                : device.type === "movimiento"
                ? "Sensor de movimiento"
                : device.type === "vibraciones"
                ? "Sensor de vibraciones"
                : device.type === "controlAcceso"
                ? "Control de acceso"
                : device.type === "aire"
                ? "Control de aire acondicionado"
                : "Flujo de agua"
            }
          />

          {device.description && (
            <Box
              sx={{
                minHeight: "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
                wordBreak: "break-word",
                minWidth: "100%",
              }}
            >
              <DevicesDetailsText
                title="Descripción"
                value={device.description}
              />
            </Box>
          )}
          <DevicesDetailsText
            title="Conectado desde el"
            value={new Date(device.createdOn!).toLocaleString("es-VE", {
              hour12: false,
              dateStyle: "short",
              timeStyle: "short",
            })}
          />
          <DevicesDetailsText title="Ubicación" value={routeRef.current} />
          <DevicesDetailsText title="Tópico" value={device.topic!} />
          <DevicesDetailsText title="Creado por" value={user?.name!} />
        </CardContent>
        <CardActions
          sx={{
            alignSelf: "flex-end",
          }}
        >
          <Button onClick={handleOpenModal}>
            <Typography fontSize={18} color={"primary.main"} fontWeight="bold">
              Ver más
            </Typography>
          </Button>
        </CardActions>
      </Card>
      <Modal
        device={device}
        isOpen={isModalOpen}
        closeDialog={handleCloseModal}
      />
    </>
  );
};

export default DeviceCard;
