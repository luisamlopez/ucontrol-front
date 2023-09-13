import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Fab,
  Tooltip,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Device,
  getAllDevicesBySpace,
  getAllDevicesByUser,
} from "../api/Device";
import { Sidebar } from "../components/Sidebar";
import CardsContainer from "../components/CardsContainer";
import DeviceCard from "../components/DevicesPage/DeviceCard";
import { AddRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/authContext";
import { get } from "http";

const DevicesPage = (): JSX.Element => {
  const [allDevices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const { user } = useUser();

  useEffect(() => {
    try {
      getAllDevicesByUser(user!._id, (devices) => {
        setDevices(devices);
      });
    } catch (error) {
    } finally {
      setDataLoaded(true);
      setLoading(false);
    }
  }, [user]);

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Box>
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
              Administrador de dispositivos
            </Typography>
            {/* <Box sx={{ mb: 2 }}>
              <TextField
                label="Buscar dispositivo"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </Box> */}
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
            ) : allDevices.length === 0 ? (
              <Typography>
                No hay dispositivos registrados en tu cuenta, agrega uno.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <CardsContainer>
                  {allDevices.map(
                    (device) => (
                      // device.name
                      //   .toLowerCase()
                      //   .includes(searchValue.toLowerCase()) ? (
                      <DeviceCard key={device._id} {...device} />
                    )
                    // ) : null
                  )}
                </CardsContainer>
              </Box>
            )}
          </Box>
        </Container>
        <Tooltip title="Agregar dispositivo" placement="left">
          <Link to={"/devices/add"}>
            <Fab
              color="secondary"
              sx={{
                m: 2,
                bottom: 50,
                right: {
                  xs: 10,
                  sm: 10,
                  md: 10,
                  lg: "5%",
                },
                position: "fixed",
              }}
            >
              <AddRounded fontSize="large" />
            </Fab>
          </Link>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DevicesPage;
