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
import DevicesDetailsText from "../DeviceDetailsText";
import { User, getUserById } from "../../api/User";
import DownloadDataModal from "./DownloadDataModal";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getAccessControlSpaceUserHistory,
  getAccessControlSpaceUsers,
} from "../../api/AccessControlUser";

const columns: any[] = [
  { field: "timestampIn", headerName: "Entrada", width: 20 },
  { field: "timestampOut", headerName: "Salida", width: 20 },
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
  const [dataPerRow, setDataPerRow] = useState<any[]>([]);
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
        await getAccessControlSpaceUserHistory(device.device._id!, (d) => {
          setData(d);
        });
      } catch (error) {}

      try {
        await getAccessControlSpaceUsers(device.device._id!, (d) => {
          setOutData(d);
        });
      } catch (error) {}
    };
    fetch();

    const interval = setInterval(() => {
      fetch();
    }, 30000);
    return () => clearInterval(interval);
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

  useEffect(() => {
    const fetch = async () => {
      let aux: any[] = [{}];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].entered.length; j++) {
          aux.push({
            timestampIn: data[i].entered[j],
            timestampOut: data[i].gotOut[j],
            name: data[i].name,
            email: data[i].email,
            career: data[i].career,
            eCard: data[i].eCard,
            ci: data[i].ci,
            state: data[i].state,
          });
        }
        for (let j = 0; j < data[i].gotOut.length; j++) {
          aux.push({
            timestampIn: data[i].entered[j],
            timestampOut: data[i].gotOut[j],
            name: data[i].name,
            email: data[i].email,
            career: data[i].career,
            eCard: data[i].eCard,
            ci: data[i].ci,
            state: data[i].state,
          });
        }
        if (!aux[0].name) {
          //delete aux[0];
          aux.shift();
        }
        setDataPerRow(aux);
      }
    };
    fetch();

    const interval = setInterval(() => {
      fetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [data]);

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
          {dataPerRow && dataPerRow.length > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cédula</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataPerRow.map((value, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {new Date(value.timestampIn).toLocaleString("es-VE", {
                        hour12: false,
                        dateStyle: "short",
                        timeStyle: "long",
                      })}
                    </TableCell>
                    <TableCell>{value.name}</TableCell>
                    <TableCell>{value.ci}</TableCell>
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cédula</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {outData.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell>{value.userName}</TableCell>
                    <TableCell>{value.userCi}</TableCell>
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
        endDate={new Date(Date.now() + 1000 * 60 * 60 * 24)}
        data={dataPerRow}
        columns={columns}
      />
    </>
  );
};

export default ACCMobileDevice;
