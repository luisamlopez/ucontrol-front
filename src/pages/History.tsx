import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Device } from "../api/Device";
import { useEffect, useState } from "react";
import HistoryTable from "../components/HistoryPage/HistoryTable";
import HistoryAccordion from "../components/HistoryPage/HistoryAccordion";
import { Space } from "../api/Space";

const History = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevices: Device[] = [
          {
            id: "1",
            name: "Device 1",
            description: "Description 1",
            createdOn: new Date(2022, 10, 1, 14, 23, 8),
            createdBy: "User 1",
            dvt: ["pie", "bar"],
            topic: ["Topic 1.2", "Topic 1.2", "Topic 1.3"],
            values: [
              {
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
                value: 40,
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
            history: [
              {
                updatedBy: "User 1",
                updatedOn: new Date(2022, 10, 1, 14, 23, 8),
                field: ["Cambio 1"],
              },
            ],
          },
          {
            id: "2",
            name: "Device 2",
            description: "Description 2",
            createdOn: new Date(2022, 10, 1, 14, 23, 8),
            createdBy: "User 2",
            dvt: ["bar", "line"],
            topic: ["Topic 2.2", "Topic 2.2", "Topic 2.3"],
            values: [
              {
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
            createdOn: new Date(2022, 10, 1, 14, 23, 8),
            createdBy: "User 3",
            dvt: ["pie"],

            topic: ["Topic 3.1", "Topic 3.2", "Topic 3.3"],
            values: [
              {
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
        const dataSpaces: Space[] = [
          {
            id: "1",
            name: "Space 1",
            description: "Description 1",
            createdOn: new Date(2022, 10, 1, 14, 23, 8),
            createdBy: "User 1",
          },

          {
            id: "2",
            name: "Space 2",
            description: "Description 1",
            createdOn: new Date(2022, 10, 1, 14, 23, 8),
            createdBy: "User 1",
            history: [
              {
                field: ["cambio 1"],
                updatedBy: "userr",
                updatedOn: new Date(2022, 10, 1, 14, 23, 8),
              },
            ],
            devices: dataDevices,
          },
        ];
        setDevices(dataDevices);
        setSpaces(dataSpaces);
        setDataLoaded(true);
      }, 2000);
    };

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    try {
      fetchData();
    } catch (error) {
      alert(error);
    } finally {
      //  window.removeEventListener("resize", handleResize);
      setLoading(false);
    }
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
              Error: no se pudieron cargar los dispositivos
            </Typography>
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
