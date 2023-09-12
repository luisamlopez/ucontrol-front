import { Box, Typography } from "@mui/material";
import { Device } from "../../api/Device";
import DevicesDetailsText from "../DeviceDetailsText";
import { useEffect, useState } from "react";
import { User, getUserById } from "../../api/User";

const CADeviceCard = (props: { device: Device }): JSX.Element => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserById(props.device.createdBy!, (user) => {
          setUser(user);
        });
      } catch (error) {}
    };
    fetch();
  }, [props.device]);
  return (
    <Box
      sx={{
        backgroundColor: "#ECEEEF",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "2",
        p: 1,
        width: "100%",
      }}
    >
      <DevicesDetailsText title="Nombre" value={props.device.name} />
      <DevicesDetailsText title="Tipo" value={"Control de Acceso"} />
      <DevicesDetailsText
        title="Fecha de creación"
        value={new Date(props.device.createdOn!).toLocaleString("es-VE", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })}
      />
      {user && <DevicesDetailsText title="Creado por" value={user?.name!} />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "white",
          p: 1,
          mt: 1,
          borderRadius: "4px",
          height: "32rem",
        }}
      ></Box>
    </Box>
  );
};

export default CADeviceCard;
