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
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import CardsContainer from "../components/CardsContainer";
import DeviceCard from "../components/DevicesPage/DeviceCard";
import { AddRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

const DevicesPage = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevices: Device[] = [
          {
            _id: "1",
            name: "Sensor luz",
            description:
              "Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 1",
            dvt: ["pie", "bar"],

            topic: ["Topic 1.1", "Topic 1.2", "Topic 1.3"],

            history: [
              {
                updatedBy: "User 1",
                updatedOn: new Date(2022, 10, 1, 14, 23, 8),
                field: ["Cambio 1"],
              },
            ],
          },
          {
            _id: "2",
            name: "Sensor de luz oficina del profe Franklin",
            description:
              "Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 2",
            dvt: ["bar", "line"],
            topic: ["Topic 2.2", "Topic 2.2", "Topic 2.3"],
          },
          {
            _id: "3",
            name: "Device 3",
            description: "Description 3",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 3",
            dvt: ["pie"],

            topic: ["Topic 3.1", "Topic 3.2", "Topic 3.3"],
          },
          {
            _id: "4",
            name: "Device 4",
            description: "Description 3",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 3",
            topic: ["Topic 3.1", "Topic 3.2", "Topic 3.3"],
            dvt: ["pie"],
          },
        ];
        setDevices(dataDevices);
        setDataLoaded(true);
      }, 2000);
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
            ) : devices.length === 0 ? (
              <Typography>
                Error: no se pudieron cargar los dispositivos.
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
                  {devices.map(
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
