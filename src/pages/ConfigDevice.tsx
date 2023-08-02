import {
  Box,
  Container,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeviceForm from "../components/DevicesPage/DeviceForm";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";

const ConfigDevice = (): JSX.Element => {
  const [device, setDevice] = useState<Device>();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  // const { deviceID } = useParams<{ deviceID: string }>();
  const location = useLocation();
  const action = location.pathname.split("/")[2];
  const deviceID = useParams<{ deviceID: string }>().deviceID;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevice: Device = {
          _id: "1",
          name: "Device 1",
          description:
            "Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1Description 1",
          createdOn: new Date("2022-01-01T00:00:00Z"),
          createdBy: "User 1",
          dvt: ["pie", "bar"],
          topic: ["Topic 1.2", "Topic 1.2", "Topic 1.3"],

              updatedBy: "User 1.23",
              updatedOn: new Date("2022-01-01T00:00:00Z"),
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
              updatedOn: new Date("2022-01-01T00:00:00Z"),
            },
          ],
          currentTopic: "Topic 1",

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
        };
        setDevice(dataDevice);
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
      <Container sx={{ m: 0, p: 0 }}>
        <Box
          display={"flex"}
          flexDirection="column"
          sx={{
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            mt={{ xs: 6, sm: 0, lg: 0 }}
            p={0}
            mb={2}
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
            >
              {action === "add" ? "Nuevo dispositivo" : "Editar dispositivo"}
            </Typography>
          </Box>
          {loading ? (
            <>
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
            <DeviceForm />
          ) : (
            <DeviceForm deviceID={deviceID!} />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ConfigDevice;
