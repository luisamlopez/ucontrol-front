import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import DashboardAccordion from "../components/Dashboard/DashboardAccordion";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/authContext";

const Home = (): JSX.Element => {
  const { user } = useUser();
  const [devices, setDevices] = useState<Device[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    console.log(user);

    const fetchData = async () => {
      setTimeout(() => {
        const dataSpaces: Space[] = [
          {
            _id: "1",
            name: "Space 1",
            description: "Description 1",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 1",
          },

          {
            _id: "2",
            name: "Space 2",
            description: "Description 1",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 1",

            history: [
              {
                field: ["cambio 1"],
                updatedBy: "userr",
                updatedOn: new Date("2022-01-01T00:00:00Z"),
              },
            ],
            devices: ["1", "2"],
          },
        ];
        //  setDevices(dataDevices);
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
            Dashboard
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
            <Typography
              color="primary"
              textAlign="left"
              fontSize={{ xs: 16, sm: 24, lg: 24 }}
              fontWeight={600}
              p={0}
              mt={{ xs: 6, sm: 0, lg: 0 }}
              mb={2}
            >
              No hay ningún espacio cargado. Por favor, cree uno.
            </Typography>
          ) : (
            <DashboardAccordion spaces={spaces} />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
