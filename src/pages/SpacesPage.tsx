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
import { Space } from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import CardsContainer from "../components/CardsContainer";
import { AddRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Device } from "../api/Device";
import SpaceCard from "../components/SpacesPage/SpaceCard";
import { useUser } from "../contexts/authContext";

const SpacesPage = (): JSX.Element => {
  const { user } = useUser();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

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
        setSpaces(dataSpaces);
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
              Administrador de espacios
            </Typography>
            {/* <Box sx={{ mb: 2 }}>
              <TextField
                label="Buscar espacio"
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
            ) : spaces.length === 0 ? (
              <Typography>
                Error: no se pudieron cargar los espacios.
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
                  {spaces.map(
                    (space) => (
                      // space.name
                      //   .toLowerCase()
                      //   .includes(searchValue.toLowerCase()) ? (
                      // <spaceCard key={space.id} {...space} />
                      <SpaceCard key={space.id} {...space} />
                    )
                    // ) : null
                  )}
                </CardsContainer>
              </Box>
            )}
          </Box>
        </Container>
        {user?.admin && (
          <Link to={"/spaces/add"}>
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
        )}
      </Box>
    </Box>
  );
};

export default SpacesPage;
