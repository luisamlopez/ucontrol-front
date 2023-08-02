import { Device } from "../../api/Device";
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
import { useState } from "react";
import { format } from "date-fns";

const DeviceCard = (device: Device): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Verifica y convierte la propiedad 'createdOn' a tipo Date
  let modifiedDevice = { ...device }; // Crea un nuevo objeto a partir del objeto original
  if (modifiedDevice.createdOn && !(modifiedDevice.createdOn instanceof Date)) {
    modifiedDevice.createdOn = new Date(modifiedDevice.createdOn);
  }

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
            xs: "340px",
            sm: "340px",
            md: "400px",
            lg: "440px",
          },
          p: 1,
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
            {device.name}
          </Typography>
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

          <DevicesDetailsText
            title="Conectado desde el"
            value={format(modifiedDevice.createdOn, "dd/MM/yyyy")}
          />
          <DevicesDetailsText
            title="Tópico"
            value={device.topic.flat().join("/")}
          />
          <DevicesDetailsText title="Creado por" value={device.createdBy} />
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
