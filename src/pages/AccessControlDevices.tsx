import {
  Box,
  Container,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Device, getAllDevicesBySpace } from "../api/Device";
import { Sidebar } from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../contexts/authContext";
import { Space, getSpaceById } from "../api/Space";
import CADeviceCard from "../components/AccessControlPage/ACDevice";
import ACCMobileDevice from "../components/AccessControlPage/ACCMobileDevice";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";

const AccessControlDevices = (): JSX.Element => {
  const [allDevices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [space, setSpace] = useState<Space>();
  const { user } = useUser();
  const spaceId = useParams<{ spaceId: string }>().spaceId;
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        await getSpaceById(spaceId!, (space) => {
          setSpace(space);
        });
      } catch (error) {}
    };

    fetch();
  }, [spaceId]);

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
    console.log(allDevices);
  }, [allDevices]);

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
          <Box
            display={"flex"}
            flexDirection="column"
            sx={{
              p: 2,
            }}
          >
            <IconButton
              sx={{
                display: {
                  lg: "none",
                },
                fontSize: "large",
                p: 0,
                mt: 0.5,
              }}
              onClick={() => navigate(-1)}
            >
              <KeyboardArrowLeftRounded
                fontSize="large"
                color="secondary"
                sx={{
                  display: {
                    lg: "none",
                  },
                }}
              />
            </IconButton>
            <Typography
              color="primary"
              textAlign="left"
              fontSize={{ xs: 24, sm: 48, lg: 48 }}
              fontWeight={600}
              p={0}
              mt={{ xs: 6, sm: 0, lg: 0 }}
              mb={2}
              sx={{
                wordWrap: "break-word",
              }}
            >
              Dispositivos de control de acceso en {space?.name}
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
                  <>
                    {windowWidth < 600 && (
                      <ACCMobileDevice key={i} device={device} />
                    )}
                    {windowWidth >= 600 && windowWidth < 960 && (
                      <ACCMobileDevice key={i} device={device} />
                    )}

                    {windowWidth >= 960 && (
                      <CADeviceCard key={i} device={device} />
                    )}
                  </>
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
