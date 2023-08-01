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
import { useState } from "react";

const SpaceCard = (space: Space): JSX.Element => {
  const [isModalOpen, setModalOpen] = useState(false);

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
            {space.name}
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
              value={space.description ? space.description : "N/A"}
            />
          </Box>
          {space.devices && (
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
              <Typography textAlign={"left"} color={"black"}>
                <ul>
                  {space.devices.map((device) => (
                    <li key={device._id}>{device.name}</li>
                  ))}
                </ul>
              </Typography>
            </Box>
          )}

          <DevicesDetailsText
            title="Conectado desde el"
            value={space.createdOn}
          />
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
      />
    </>
  );
};

export default SpaceCard;
