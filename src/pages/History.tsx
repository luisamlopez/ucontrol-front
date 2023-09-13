import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Device, getAllDevicesByUser } from "../api/Device";
import { useEffect, useState } from "react";
import HistoryTable from "../components/HistoryPage/HistoryTable";
import HistoryAccordion from "../components/HistoryPage/HistoryAccordion";
import { Space, getSpaces } from "../api/Space";
import { useUser } from "../contexts/authContext";

const History = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const { user } = useUser();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  /**
   * Get all spaces from API but only keep the ones with history
   */

  useEffect(() => {
    const fetch = async () => {
      try {
        await getSpaces(user?._id!, (allSpaces) => {
          allSpaces = allSpaces.filter(
            (space) => space.history && space.history.length > 0
          );
          setSpaces(allSpaces);
        });
        await getAllDevicesByUser(user!._id!, (allDevices) => {
          //Get devices with history only
          allDevices = allDevices.filter(
            (device) => device.history && device.history.length > 0
          );
          // Invert order of array
          allDevices = allDevices.reverse();
          setDevices(allDevices);
        });
        setDataLoaded(false);
      } catch (error) {}
    };
    fetch();
  }, [user, user?._id]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0 }}>
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
            Historial de dispositivos
          </Typography>
          {!dataLoaded ? (
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
            <Typography>No hay dispositivos con historial.</Typography>
          ) : (
            <>
              {windowWidth < 600 && <HistoryAccordion devices={devices} />}
              {windowWidth >= 600 && windowWidth < 960 && (
                <HistoryAccordion devices={devices} />
              )}
              {windowWidth >= 960 && <HistoryTable devices={devices} />}
            </>
          )}

          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, sm: 48, lg: 48 }}
            fontWeight={600}
            p={0}
            mt={{ xs: 6, sm: 0, lg: 0 }}
            mb={2}
          >
            Historial de espacios
          </Typography>
          {!dataLoaded ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : spaces.length === 0 ? (
            <Typography>Error: no se pudieron cargar los espacios</Typography>
          ) : (
            <>
              {windowWidth < 600 && <HistoryAccordion spaces={spaces} />}
              {windowWidth >= 600 && windowWidth < 960 && (
                <HistoryAccordion spaces={spaces} />
              )}
              {windowWidth >= 960 && <HistoryTable spaces={spaces} />}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default History;
