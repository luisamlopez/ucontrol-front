import { Space } from "../../api/Space";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import DevicesDetailsText from "../DeviceDetailsText";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Device, getDeviceById } from "../../api/Device";
import { User, getUserById } from "../../api/User";

const SpaceCard = (space: Space): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  const [user, setUser] = useState<User>();
  // Verifica y convierte la propiedad 'createdOn' a tipo Date
  let modifiedSpace = { ...space }; // Crea un nuevo objeto a partir del objeto original
  if (modifiedSpace.createdOn && !(modifiedSpace.createdOn instanceof Date)) {
    modifiedSpace.createdOn = new Date(modifiedSpace.createdOn);
  }

  useEffect(() => {
    if (space.devices && space.devices.length > 0) {
      try {
        const dev: Device[] = [];
        for (let i = 0; i < space.devices.length; i++) {
          getDeviceById(space.devices[i], (device) => {
            dev.push(device);
          });
        }
        setDevices(dev);
        setDevicesLoaded(true);
      } catch (error) {
        console.log(error);
      }
    }
  }, [space.devices]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserById(space.createdBy, (user) => {
          setUser(user);
        });
        space.createdBy = user?.name!;
      } catch (error) {}
    };
    fetch();
  }, [space, space.createdBy, user?.name]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
          width: "350px",
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
              minHeight: { xs: "50px", sm: "50px", md: "50px", lg: "auto" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "wrap",
              wordBreak: "break-word",
              minWidth: "100%",
            }}
          >
            {space.name}
          </Typography>
          {space.description && (
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
                value={space.description!}
              />
            </Box>
          )}

          {devicesLoaded && (
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
              <Typography textAlign={"left"} fontWeight="bold" color={"black"}>
                Dispositivos:
              </Typography>
              <Box>
                <ul>
                  {devices.map((device) => (
                    <li key={device._id}>{device.name}</li>
                  ))}
                </ul>
              </Box>
            </Box>
          )}

          <DevicesDetailsText
            title="Creado el"
            value={new Date(space.createdOn!).toLocaleString("es-VE", {
              hour12: false,
              dateStyle: "short",
              timeStyle: "short",
            })}
          />
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
        space={space}
        isOpen={isModalOpen}
        closeDialog={handleCloseModal}
        spaceDevices={devices}
      />
    </>
  );
};

export default SpaceCard;
