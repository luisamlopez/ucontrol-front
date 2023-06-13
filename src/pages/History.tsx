import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { Device } from "../api/Devices";
import { useEffect, useState } from "react";
import HistoryTable from "../components/HistoryTable";

const History = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const data: Device[] = [
          {
            id: "1",
            name: "Device 1",
            description: "Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",
            history: [
              {
                name: "Device 1",
                description: "Description 1",
                topic: "Topic 1",
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
                updatedBy: "User 1.23",
                updatedOn: "2021-10-01",
              },
              {
                name: "Device 1.1",
                description: "Description 1.1",
                topic: "Topic 1.1",
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
                updatedBy: "User 1.5",
                updatedOn: "2021-10-01",
              },
            ],
            currentTopic: "Topic 1",
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
            id: "2",
            name: "Device 2",
            description: "Description 2",
            createdOn: "2021-10-01",
            createdBy: "User 2",
            currentTopic: "Topic 2",
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
            id: "3",
            name: "Device 3",
            description: "Description 3",
            createdOn: "2021-10-01",
            createdBy: "User 3",
            currentTopic: "Topic 3",
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
        ];
        setDevices(data);
      }, 5000);
    };
    fetchData();
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0 }}>
        <Box display={"flex"} flexDirection="column">
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, sm: 48, lg: 48 }}
            fontWeight={600}
            p={0}
            mt={{ xs: 10, sm: 0, lg: 0 }}
            mb={5}
          >
            Historial
          </Typography>
          {devices.length === 0 ? (
            <Typography
              color={"primary"}
              textAlign="left"
              fontSize={{ xs: 24, sm: 48, lg: 48 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            </Typography>
          ) : (
            <HistoryTable devices={devices} />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default History;
