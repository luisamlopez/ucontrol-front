import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Device, getAllDevicesBySpace } from "../api/Device";
import { Sidebar } from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { useUser } from "../contexts/authContext";
import { Space, getSpaceById } from "../api/Space";
import CADeviceCard from "../components/AccessControlPage/ACDevice";

const AccessControlDevices = (): JSX.Element => {
  const [allDevices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [space, setSpace] = useState<Space>();
  const { user } = useUser();
  const spaceId = useParams<{ spaceId: string }>().spaceId;

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
            <Typography
              color="primary"
              textAlign="left"
              fontSize={{ xs: 24, sm: 48, lg: 48 }}
              fontWeight={600}
              p={0}
              mt={{ xs: 6, sm: 0, lg: 0 }}
              mb={2}
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
                  <CADeviceCard key={i} device={device} />
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
