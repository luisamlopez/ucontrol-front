import { Box, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import DashboardAccordion from "../components/DashboardAccordion";
import { Device } from "../api/Device";
import { Space } from "../api/Space";

const Home = (): JSX.Element => {
  const dataDevices: Device[] = [
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
              value: "10",
            },
            {
              metric: "Metric 2",
              unit: "Unit 2",
              value: "10",
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
              value: "20",
            },
            {
              metric: "Metric 2",
              unit: "Unit 2",
              value: "20",
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
          value: "10",
        },
        {
          metric: "Metric 2",
          unit: "Unit 2",
          value: "10",
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
          value: "10",
        },
        {
          metric: "Metric 2",
          unit: "Unit 2",
          value: "10",
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
          value: "10",
        },
        {
          metric: "Metric 2",
          unit: "Unit 2",
          value: "10",
        },
      ],
    },
  ];

  const dataSpaces: Space[] = [
    {
      id: "1",
      name: "Space 1",
      description: "Description 1",
      createdOn: "2021-10-01",
      createdBy: "User 1",
      currentRoute: "/space/1",
    },

    {
      id: "2",
      name: "Space 2",
      description: "Description 1",
      createdOn: "2021-10-01",
      createdBy: "User 1",
      currentRoute: "/space/1",
      history: [
        {
          name: "cambio 1",
          description: "descipcion 2",
          updatedBy: "userr",
          updatedOn: "565",
          route: "ruta",
        },
      ],
      devices: [
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
                  value: "10",
                },
                {
                  metric: "Metric 2",
                  unit: "Unit 2",
                  value: "10",
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
                  value: "20",
                },
                {
                  metric: "Metric 2",
                  unit: "Unit 2",
                  value: "20",
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
              value: "10",
            },
            {
              metric: "Metric 2",
              unit: "Unit 2",
              value: "10",
            },
          ],
        },
      ],
    },
  ];

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
            Dashboard
          </Typography>

          <DashboardAccordion spaces={dataSpaces} />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
