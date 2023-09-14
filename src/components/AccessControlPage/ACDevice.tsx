import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Table,
  TableBody,
  Typography,
} from "@mui/material";
import { Device } from "../../api/Device";
import DevicesDetailsText from "../DeviceDetailsText";
import { useEffect, useState } from "react";
import { User, getUserById } from "../../api/User";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

//Columns for the DataGrid are the user atributes
const columns: any[] = [
  { field: "timestamp", headerName: "Fecha", width: 20 },
  { field: "name", headerName: "Nombre", width: 70 },
  { field: "state", headerName: "Acceso", width: 20 },
  { field: "ci", headerName: "Cédula", width: 50 },
  { field: "email", headerName: "Correo", width: 20 },
  { field: "eCard", headerName: "Código de carnet", width: 20 },
  { field: "career", headerName: "Carrera", width: 20 },
];

const CADeviceCard = (props: { device: Device }): JSX.Element => {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<Date | null>(
    new Date(props.device.createdOn!)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 1000 * 60 * 60 * 24)
  );
  const [data, setData] = useState<any[]>([]);
  const [outData, setOutData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = [
          {
            timestamp: new Date("2023-09-14T00:10:00.000Z"),
            name: "Juan Perez",
            state: "1",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
          {
            timestamp: new Date("2023-09-14T00:00:00.000Z"),
            name: "Juan Perez",
            state: "0",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
          {
            timestamp: new Date("2023-09-14T00:00:00.000Z"),
            name: "Juan Perez",
            state: "1",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
          {
            timestamp: new Date("2023-09-14T05:00:00.000Z"),
            name: "Juan Perez",
            state: "1",
            ci: "12345678",
            email: "juan@mail.com",
            eCard: "12345678",
            career: "Ingenieria de Sistemas",
          },
        ];
        setData(data);
        setOutData(data);
      } catch (error) {}
    };
    fetch();
  }, [props.device]);
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = data.filter((value) => {
        const timestamp = new Date(value.timestamp);
        return timestamp >= startDate && timestamp <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [startDate, endDate, data]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserById(props.device.createdBy!, (user) => {
          setUser(user);
        });
      } catch (error) {}
    };
    fetch();
  }, [props.device]);

  return (
    <Box
      sx={{
        marginBottom: "10px",
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
          fontSize={{ xs: 24, sm: 48, lg: 48 }}
          fontWeight={600}
          p={0}
          mt={{ xs: 6, sm: 0, lg: 0 }}
          mb={2}
          sx={{
            wordWrap: "break-word",
          }}
        >
          Control de acceso controlado por {props.device?.name}
        </Typography>
      </Box>

      <DevicesDetailsText title="Nombre" value={props.device.name} />
      <DevicesDetailsText title="Tipo" value={"Control de Acceso"} />
      <DevicesDetailsText
        title="Fecha de creación"
        value={new Date(props.device.createdOn!).toLocaleString("es-VE", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        })}
      />
      {user && <DevicesDetailsText title="Creado por" value={user?.name!} />}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            m: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Desde"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <DatePicker
              label="Hasta"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </LocalizationProvider>
        </Box>
        {data && data.length > 0 && (
          <>
            <DataGrid
              sx={{ width: "100%" }}
              rows={filteredData.map((value, index) => ({
                id: index,
                timestamp: new Date(value.timestamp).toLocaleString("VET", {
                  hour12: false,
                  dateStyle: "short",
                  timeStyle: "long",
                }),
                name: value.name,
                state: value.state,
                ci: value.ci,
                email: value.email,
                eCard: value.eCard,
                career: value.career,
              }))}
              columns={columns.map((column) => ({
                field: column.field,
                headerName: column.headerName,
                width: 150,
              }))}
              slots={{
                toolbar: () => (
                  <CustomToolbar startDate={startDate!} endDate={endDate!} />
                ),
              }}
            />
          </>
        )}
        {data && data.length === 0 && (
          <Typography>No hay datos para mostrar</Typography>
        )}
        <Typography sx={{ my: 2, fontWeight: 600 }}>
          Usuarios que se encuentran en el espacio
        </Typography>
        {outData && outData.length > 0 && (
          <>
            <DataGrid
              sx={{ width: "100%" }}
              rows={outData.map((value, index) => ({
                id: index,
                timestamp: new Date(value.timestamp).toLocaleString("VET", {
                  hour12: false,
                  dateStyle: "short",
                  timeStyle: "long",
                }),
                name: value.name,
                state: value.state,
                ci: value.ci,
                email: value.email,
                eCard: value.eCard,
                career: value.career,
              }))}
              columns={columns.map((column) => ({
                field: column.field,
                headerName: column.headerName,
                width: 150,
              }))}
            />
          </>
        )}
        {outData && outData.length === 0 && (
          <Typography>No hay datos para mostrar</Typography>
        )}
      </Box>
    </Box>
  );
};

function CustomToolbar({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        printOptions={{ disableToolbarButton: true }}
        csvOptions={{
          fileName: `Datos desde ${startDate.toLocaleString("es-VE", {
            hour12: false,
            dateStyle: "short",
            timeStyle: "long",
          })} hasta ${endDate.toLocaleString("es-VE", {
            hour12: false,
            dateStyle: "short",
            timeStyle: "long",
          })}`,
          delimiter: ";",
          utf8WithBom: true,
        }}
      />
    </GridToolbarContainer>
  );
}

export default CADeviceCard;
