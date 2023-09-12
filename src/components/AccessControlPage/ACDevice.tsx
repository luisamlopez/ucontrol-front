import { Box, Typography } from "@mui/material";
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
  { field: "timestamp", headerName: "Fecha", width: 200 },
  { field: "name", headerName: "Nombre", width: 200 },
  { field: "state", headerName: "Acceso", width: 200 },
  { field: "ci", headerName: "Cédula", width: 200 },
  { field: "email", headerName: "Correo", width: 200 },
  { field: "eCard", headerName: "Código de carnet", width: 200 },
  { field: "career", headerName: "Carrera", width: 200 },
];

const CADeviceCard = (props: { device: Device }): JSX.Element => {
  const [user, setUser] = useState<User>();
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(props.device.createdOn!)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now()));
  const [data, setData] = useState<any[]>([]);

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
            justifyContent: "space-between",
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
          <DataGrid
            rows={filteredData.map((value, index) => ({
              id: index,
              timestamp: new Date(value.timestamp).toLocaleString("es-VE", {
                hour12: false,
                dateStyle: "short",
                timeStyle: "long",
              }),
              state:
                value.state === "1"
                  ? "Presencia detectada"
                  : "No hay presencia detectada",
            }))}
            columns={columns.map((column) => ({
              field: column.field,
              headerName: column.headerName,
              width: 200,
            }))}
            slots={{
              toolbar: () => (
                <CustomToolbar startDate={startDate!} endDate={endDate!} />
              ),
            }}
          />
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
