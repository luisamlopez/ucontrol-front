import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(props.device.createdOn!)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now()));
  const [data, setData] = useState<any[]>([]);

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
        backgroundColor: "#ECEEEF",
        borderRadius: "8px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "2",
        p: 1,
        width: "100%",
      }}
    >
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
          borderRadius: "4px",
          height: "32rem",
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
                timestamp: new Date(value.timestamp).toLocaleString("es-VE", {
                  hour12: false,
                  dateStyle: "short",
                  timeStyle: "long",
                }),
                name: value.name,
                state:
                  value.state === 1 ? "Acceso concedido" : "Acceso denegado",
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
