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
import { Space, getSpaces } from "../api/Space";
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
    try {
      getSpaces((allSpaces) => {
        setSpaces(allSpaces);
        setDataLoaded(true);
      });
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
                No hay espacios registrados. Agrega uno nuevo.
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
                      // <spaceCard key={space._id} {...space} />
                      <SpaceCard key={space._id} {...space} />
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
