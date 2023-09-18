import { Box, Container, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Device, getAllDevicesBySpace } from "../api/Device";
import { Sidebar } from "../components/Sidebar";
import { useParams } from "react-router-dom";
import CADeviceCard from "../components/AccessControlPage/ACDevice";
import ACCMobileDevice from "../components/AccessControlPage/ACCMobileDevice";

const AccessControlDevices = (): JSX.Element => {
  const [allDevices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const spaceId = useParams<{ spaceId: string }>().spaceId;
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getAllDevicesBySpace(spaceId!, (devices) => {
          setDevices(
            devices?.filter((device) => device.type === "controlAcceso")!
          );
          setLoading(false);
          setDataLoaded(true);
        });
      } catch (error) {}
    };
    fetch();
  }, [spaceId]);

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
    <>
      <Box display="flex" alignItems="center" justifyContent="left">
        <Sidebar />
        <Container sx={{ m: 0, p: 0 }}>
          <Box display={"flex"} flexDirection="column">
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
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "10px",
                  width: "100%",
                }}
              >
                {allDevices.map((device, i) => (
                  <Box m={0} key={i}>
                    {windowWidth < 600 && (
                      <ACCMobileDevice key={i} device={device} />
                    )}
                    {windowWidth >= 600 && windowWidth < 960 && (
                      <ACCMobileDevice key={i} device={device} />
                    )}

                    {windowWidth >= 960 && (
                      <CADeviceCard key={i} device={device} />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AccessControlDevices;
