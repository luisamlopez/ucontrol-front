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
import {
  Device,
  getAllDevicesBySpace,
  getAllDevicesByUser,
} from "../api/Device";
import { Sidebar } from "../components/Sidebar";
import CardsContainer from "../components/CardsContainer";
import DeviceCard from "../components/DevicesPage/DeviceCard";
import { AddRounded } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../contexts/authContext";
import { Space, getSpaceById } from "../api/Space";

const ControlAccessDevices = (): JSX.Element => {
  const [allDevices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [space, setSpace] = useState<Space>();
  const { user } = useUser();
  const spaceId = useParams<{ spaceId: string }>().spaceId;

  useEffect(() => {
    try {
      getSpaceById(spaceId!, (space) => {
        setSpace(space);
      });
    } catch (error) {}
  }, [spaceId]);

  useEffect(() => {
    try {
      getAllDevicesBySpace(spaceId!, (devices) => {
        console.log(devices);
      });
    } catch (error) {
      alert(error);
    } finally {
      setDataLoaded(true);
      setLoading(false);
    }
  }, [spaceId]);

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
              Dispositivos de control de acceso en {space?.name}
            </Typography>

            <Typography>
              aqui puede haber tarjetas de los dispositivos de contro de acceso
              del espacio y que cada una lleve a la pagina de detalles del
              dispositivo en donde se va a ver la lista de los usuarios que han
              pasado la tarjeta, nombre, timestamp y si fue concedido el acceso
              o no
            </Typography>
            {/*           
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
            ) : allDevices.length === 0 ? (
              <Typography>
                No hay dispositivos registrados en tu cuenta, agrega uno.
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
                  {allDevices.map(
                    (device) => (
                      // device.name
                      //   .toLowerCase()
                      //   .includes(searchValue.toLowerCase()) ? (
                      <DeviceCard key={device._id} {...device} />
                    )
                    // ) : null
                  )}
                </CardsContainer>
              </Box>
            )} */}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ControlAccessDevices;
