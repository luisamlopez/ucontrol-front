import * as React from "react";
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

const DeviceCard = (device: Device): JSX.Element => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "left",
        flexGrow: 1,
        m: 1,
        backgroundColor: "#ECEEEF",
        borderRadius: "8px",
        height: "440px",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          height: "calc(100% - 84px)",
          overflowY: "hidden",
        }}
      >
        <Typography
          variant="h3"
          fontSize={24}
          fontWeight={"bold"}
          color={"primary.main"}
          mb={1}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {device.name}
        </Typography>
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "10%",
          }}
        >
          <DevicesDetailsText title="Descripción" value={device.description} />
        </Box>

        <DevicesDetailsText
          title="Conectado desde el"
          value={device.createdOn}
        />
        <DevicesDetailsText title="Tópico" value={device.currentTopic} />
        <DevicesDetailsText title="Creado por" value={device.createdBy} />
      </CardContent>
      <CardActions
        sx={{
          alignSelf: "flex-end",
        }}
      >
        <Button>
          <Typography fontSize={18} color={"primary.main"} fontWeight="bold">
            Ver más
          </Typography>
        </Button>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;
