import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Device } from "../../api/Device";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "formik-mui-lab";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import CADeviceCard from "./ACDevice";
import DevicesDetailsText from "../DeviceDetailsText";
import { User, getUserById } from "../../api/User";
import DownloadDataModal from "./DownloadDataModal";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const columns: any[] = [
  { field: "timestamp", headerName: "Fecha", width: 20 },
  { field: "name", headerName: "Nombre", width: 70 },
  { field: "state", headerName: "Acceso", width: 20 },
  { field: "ci", headerName: "Cédula", width: 50 },
  { field: "email", headerName: "Correo", width: 20 },
  { field: "eCard", headerName: "Código de carnet", width: 20 },
  { field: "career", headerName: "Carrera", width: 20 },
];

const ACCMobileDevice = (device: { device: Device }): JSX.Element => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]);
  const [outData, setOutData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = [
          {
            timestamp: new Date("2023-09-10T00:00:00.000Z"),
            name: "Juan Perez",
            state: "1",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
          {
            timestamp: new Date("2023-09-10T00:00:00.000Z"),
            name: "Juan Perez",
            state: "0",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
          {
            timestamp: new Date("2023-09-10T00:00:00.000Z"),
            name: "Juan Perez",
            state: "1",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
          {
            timestamp: new Date("2023-09-10T00:00:00.000Z"),
            name: "Juan Perez",
            state: "1",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
        ];
        setData(data);
      } catch (error) {}
    };
    fetch();
  }, [device.device]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserById(device.device.createdBy!, (user) => {
          setUser(user);
        });
      } catch (error) {}
    };
    fetch();
  }, [device.device]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "2",
          p: 1,
          width: "100%",
        }}
      >
        <Box
          display={"flex"}
          flexDirection="row"
          alignItems={"center"}
          justifyContent={"space-between"}
          mt={{ xs: 6, sm: 0, lg: 0 }}
          sx={{
            p: 2,
          }}
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
            justifySelf={"center"}
            fontSize={{ xs: 24, sm: 24, lg: 24 }}
            fontWeight={600}
            p={0}
            sx={{
              wordWrap: "break-word",
            }}
          >
            Control de acceso controlado por {device.device?.name}
          </Typography>
        </Box>
        <DevicesDetailsText title="Nombre" value={device.device.name} />
        <DevicesDetailsText title="Tipo" value={"Control de Acceso"} />
        <DevicesDetailsText
          title="Fecha de creación"
          value={new Date(device.device.createdOn!).toLocaleString("es-VE", {
            hour12: false,
            dateStyle: "short",
            timeStyle: "short",
          })}
        />
        {user && <DevicesDetailsText title="Creado por" value={user?.name!} />}
        <Button
          variant="contained"
          sx={{
            mb: 2,
            zIndex: 1,
            placeSelf: "flex-end",
            width: "100%",
          }}
          onClick={handleOpenModal}
        >
          Descargar tabla completa
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            backgroundColor: "white",
            p: 1,
            mt: 1,
          }}
        >
          {data && data.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="right">Nombre</TableCell>
                  <TableCell align="right">Cédula</TableCell>
                  <TableCell align="right">Acceso</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((value, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {new Date(value.timestamp).toLocaleString("es-VE", {
                        hour12: false,
                        dateStyle: "short",
                        timeStyle: "long",
                      })}
                    </TableCell>
                    <TableCell align="right">{value.name}</TableCell>
                    <TableCell align="right">{value.ci}</TableCell>
                    <TableCell align="right"> {value.state}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {data && data.length === 0 && (
            <Typography>No hay datos para mostrar</Typography>
          )}
          <Typography sx={{ my: 2, fontWeight: 600 }}>
            Usuarios que se encuentran en el espacio
          </Typography>
          {outData && outData.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="right">Nombre</TableCell>
                  <TableCell align="right">Cédula</TableCell>
                  <TableCell align="right">Acceso</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outData.map((value, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {new Date(value.timestamp).toLocaleString("es-VE", {
                        hour12: false,
                        dateStyle: "short",
                        timeStyle: "long",
                      })}
                    </TableCell>
                    <TableCell align="right">{value.name}</TableCell>
                    <TableCell align="right">{value.ci}</TableCell>
                    <TableCell align="right"> {value.state}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        startDate={new Date(device.device.createdOn!)}
        endDate={new Date(Date.now())}
        data={data}
        columns={columns}
      />
    </>
  );
};

export default ACCMobileDevice;
