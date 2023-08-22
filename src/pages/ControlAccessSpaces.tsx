import { AddRounded } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Fab,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Space, getSpaces } from "../api/Space";
import CardsContainer from "../components/CardsContainer";
import { Sidebar } from "../components/Sidebar";
import SpaceCard from "../components/SpacesPage/SpaceCard";
import { useUser } from "../contexts/authContext";
import ControlAccessCard from "../components/ControlAccessPage/ControlAccessCard";

const ControlAccessSpaces = (): JSX.Element => {
  const { user } = useUser();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    try {
      getSpaces((allSpaces) => {
        //Filter spaces and keep only the ones that have a device with the property 'type' equal to 'controlAcceso'

        setSpaces(allSpaces);
        setDataLoaded(true);
      });
      //  console.log(spaces);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
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
          No hay espacios registrados que contengan dispositivos de control de
          acceso. Agrega uno nuevo en el módulo de Administrar de espacios.
        </Typography>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="left">
          <Sidebar />
          <Box width={"100%"}>
            <Container sx={{ m: 0, p: 0, width: "100%" }}>
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
                  Control de acceso
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  {spaces.map(
                    (space) => (
                      // space.name
                      //   .toLowerCase()
                      //   .includes(searchValue.toLowerCase()) ? (
                      // <spaceCard key={space._id} {...space} />
                      <ControlAccessCard key={space._id} {...space} />
                    )
                    // ) : null
                  )}
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ControlAccessSpaces;
