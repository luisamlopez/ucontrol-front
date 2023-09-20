import {
  Box,
  Container,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Device, getAllDevicesBySpace } from "../api/Device";
import { Space, getSpaceById, getSpaces } from "../api/Space";
import { Sidebar } from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import SpaceDeviceDetails from "../components/Dashboard/SpaceDeviceDetails";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";

const SpacePage = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [space, setSpace] = useState<Space>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { spaceID } = useParams<{ spaceID: string }>();

  /**
   * Get space info from DB by ID
   */
  useEffect(() => {
    const fetch = async () => {
      try {
        await getSpaceById(spaceID!, (space) => {
          setSpace(space);
          setLoading(false);
          setDataLoaded(true);
        });
      } catch (error) {
        alert(error);
      }
    };
    fetch();
  }, [spaceID]);

  /**
   * Get devices from the space using spaceID but keep only the ones that are not type controlAcceso
   */
  useEffect(() => {
    const fetch = async () => {
      try {
        await getAllDevicesBySpace(spaceID!, (devices) => {
          setDevices(devices!);
          setLoading(false);
          setDataLoaded(true);
        });
      } catch (error) {}
    };
    fetch();
  }, [spaceID]);

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0 }}>
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
        ) : !space ? (
          <Typography>
            Error: no se pudo cargar la información del espacio {spaceID}
          </Typography>
        ) : (
          <Box
            display={"flex"}
            flexDirection="column"
            sx={{
              p: 2,
            }}
          >
            <Box display={"flex"}>
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
                p={0}
                mt={{ xs: 6, sm: 0, lg: 0 }}
                mb={2}
              >
                Dispositivos del espacio: {space.name}
              </Typography>
            </Box>

            <SpaceDeviceDetails devices={devices} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SpacePage;
