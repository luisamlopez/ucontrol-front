import { Box, Container, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Device, getAllDevicesBySpace } from "../api/Device";
import { Sidebar } from "../components/Sidebar";
import { useParams } from "react-router-dom";
import CADeviceCard from "../components/AccessControlPage/ACDevice";
import ACCMobileDevice from "../components/AccessControlPage/ACCMobileDevice";
import { ACSpace, getAccessControlSpace } from "../api/Space";

const AccessControlDevices = (): JSX.Element => {
  const [device, setDevice] = useState<ACSpace>();
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const spaceId = useParams<{ spaceId: string }>().spaceId;
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getAccessControlSpace(spaceId!, (dev) => {
          setDevice(dev);
        });
        setLoading(false);
        setDataLoaded(true);
      } catch (error) {
        console.log(error);
      }
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
                {device && (
                  <Box m={0}>
                    {windowWidth < 600 && <ACCMobileDevice space={device} />}
                    {windowWidth >= 600 && windowWidth < 960 && (
                      <ACCMobileDevice space={device} />
                    )}

                    {windowWidth >= 960 && <CADeviceCard space={device} />}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AccessControlDevices;
