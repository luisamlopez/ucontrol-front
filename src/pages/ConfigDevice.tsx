import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import { useLocation, useParams } from "react-router-dom";

const ConfigDevice = (): JSX.Element => {
  const [device, setDevice] = useState<Device>();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  // const { deviceID } = useParams<{ deviceID: string }>();
  const location = useLocation();
  const action = location.pathname.split("/")[2];
  const deviceID = new URLSearchParams(location.search).get("deviceID");

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevice: Device = {
          id: "1",
          name: "Device 1",
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
        };
        //  setDevice(dataDevice);
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
          {loading ? (
            <>
              <Typography
                color="primary"
                textAlign="left"
                fontSize={{ xs: 24, sm: 48, lg: 48 }}
                fontWeight={600}
                p={0}
                mt={{ xs: 6, sm: 0, lg: 0 }}
                mb={2}
              >
                {action === "add"
                  ? "Nuevo dispositivo"
                  : `Editar dispositivo ${device?.name} ${deviceID}`}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            </>
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
          ) : action === "add" ? (
            <>Add</>
          ) : (
            <>Edit</>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ConfigDevice;