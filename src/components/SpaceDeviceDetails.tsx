import { Box, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Device } from "../api/Device";
import { Space } from "../api/Space";

const SpaceDeviceDetails = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevices: Device[] = [];
        const dataSpaces: Space[] = [];
        setDevices(dataDevices);
        setSpaces(dataSpaces);
        setDataLoaded(true);
      }, 5000);
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
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#ECEEEF",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
      }}
    >
      <Typography
        fontWeight={"bold"}
        textAlign={"left"}
        fontSize={{ xs: 14, sm: 18, lg: 18 }}
      >
        Dispositivo del espacio
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
        <Typography>Error: no se pudieron cargar los dispositivos.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              lg: "row",
              md: "row",
              xs: "column",
              sm: "column",
            },
            width: "100%",
            borderRadius: "4px",
            p: 1,
            justifyContent: "space-between",
          }}
        >
          <Box></Box>
        </Box>
      )}
    </Box>
  );
};

export default SpaceDeviceDetails;
