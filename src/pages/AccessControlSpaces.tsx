import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import {
  ACSpace,
  Space,
  getACSpaces,
  getAccessControlSpace,
  getSpaces,
} from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import ACCard from "../components/AccessControlPage/ACCard";
import { useUser } from "../contexts/authContext";

const AccessControlSpaces = (): JSX.Element => {
  const [spaces, setSpaces] = useState<ACSpace[]>([]);
  const [aCCard, setACCard] = useState<ACSpace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    const fetch = async () => {
      try {
        await getACSpaces(user?._id!, (allSpaces) => {
          allSpaces = allSpaces.filter(
            (space) => space.devices && space.devices.length > 0
          );
          setSpaces(allSpaces);
        });

        // setLoading(false);
        // setDataLoaded(true);
      } catch (error) {}
    };
    fetch();
  }, [user?._id]);

  useEffect(() => {
    const fetch = async () => {
      let dev: ACSpace[] = [];
      for (let i = 0; i < spaces.length; i++) {
        if (spaces[i].devices) {
          for (let j = 0; j < spaces[i].devices!.length; j++) {
            try {
              await getAccessControlSpace(spaces[i].devices![j], (space) => {
                if (space) {
                  dev.push(space);
                }
              });
              // console.log(spaces[i].devices![j]);
            } catch (error) {}
          }
        }
      }
      setACCard(dev);
      setLoading(false);
      setDataLoaded(true);
    };
    fetch();
  }, [spaces]);

  return (
    <>
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
              sx={{
                wordWrap: "break-word",
              }}
            >
              Control de acceso
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
                No hay espacios registrados que contengan dispositivos de
                control de acceso. Agrega uno nuevo en el módulo de Administrar
                de espacios.
              </Typography>
            ) : (
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
                {aCCard.map((space) => (
                  <ACCard key={space._id} {...space} />
                ))}
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AccessControlSpaces;
