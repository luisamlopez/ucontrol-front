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
            id: "1",
            name: "Sensor luz",
            description:
              "Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",
            dataVisualizationType: ["pie", "bar"],
            history: [
              {
                name: "Device 1",
                description: "Description 1",
                topic: "Topic 1",
                dataVisualizationType: ["pie", "line"],
                values: [
                  {
                    timestamp: "2021-10-01",
                    value: 10,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-02",
                    value: 20,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-03",
                    value: 30,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                ],

                updatedBy: "User 1.23",
                updatedOn: "2021-10-01",
              },
              {
                name: "Device 1.1",
                description: "Description 1.1",
                topic: "Topic 1.1",
                dataVisualizationType: ["pie", "gauge"],
                values: [
                  {
                    timestamp: "2021-10-01",
                    value: 10,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-02",
                    value: 20,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-03",
                    value: 30,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                ],
                updatedBy: "User 1.5",
                updatedOn: "2021-10-01",
              },
            ],
            currentTopic: "Topic 1",

            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-03",
                value: 30,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
            ],
          },
          {
            id: "2",
            name: "Sensor de luz oficina del profe Franklin",
            description:
              "Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2Description 2",
            createdOn: "2021-10-01",
            createdBy: "User 2",
            currentTopic: "Topic 2",
            dataVisualizationType: ["bar", "line"],
            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                  {
                    metric: "Metric 3",
                    unit: "Unit 3",
                  },
                  {
                    metric: "Metric 4",
                    unit: "Unit 4",
                  },
                  {
                    metric: "Metric 5",
                    unit: "Unit 5",
                  },
                ],
              },
              {
                timestamp: "2021-10-03",
                value: 30,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                  {
                    metric: "Metric 3",
                    unit: "Unit 3",
                  },
                  {
                    metric: "Metric 4",
                    unit: "Unit 4",
                  },
                  {
                    metric: "Metric 5",
                    unit: "Unit 5",
                  },
                ],
              },
            ],
          },
          {
            id: "3",
            name: "Device 3",
            description: "Description 3",
            createdOn: "2021-10-01",
            createdBy: "User 3",
            currentTopic: "Topic 3",
            dataVisualizationType: ["pie"],
            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-03",
                value: 30,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
            ],
          },
          {
            id: "4",
            name: "Device 4",
            description: "Description 3",
            createdOn: "2021-10-01",
            createdBy: "User 3",
            currentTopic: "Topic 3",
            dataVisualizationType: ["pie"],
            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-03",
                value: 30,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
            ],
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
                      <DeviceCard key={device.id} {...device} />
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
