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
import { useNavigate } from "react-router-dom";
import {
  getAccessControlSpaceUserHistory,
  getAccessControlSpaceUsers,
} from "../../api/AccessControlUser";
import { ACSpace } from "../../api/Space";

//Columns for the DataGrid are the user atributes
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

const columnsOut: any[] = [
  { field: "name", headerName: "Nombre", width: 70 },
  { field: "ci", headerName: "Cédula", width: 50 },
  { field: "email", headerName: "Correo", width: 20 },
  { field: "eCard", headerName: "Código de carnet", width: 20 },
  { field: "career", headerName: "Carrera", width: 20 },
];

const CADeviceCard = (space: { space: ACSpace }): JSX.Element => {
  const [user, setUser] = useState<User>();

  const [startDate, setStartDate] = useState<Date | null>(
    new Date(space.space.createdOn!)
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 1000 * 60 * 60 * 24)
  );
  const [data, setData] = useState<any[]>([]);
  const [outData, setOutData] = useState<any[]>([]);
  const [dataPerRow, setDataPerRow] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getAccessControlSpaceUserHistory(space.space.deviceId!, (d) => {
          setData(d);
        });
      } catch (error) {}

      try {
        await getAccessControlSpaceUsers(space.space.deviceId!, (d) => {
          setOutData(d);
        });
      } catch (error) {}
    };
    fetch();

    const interval = setInterval(() => {
      fetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [space.space.deviceId]);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const [filteredData, setFilteredData] = useState(dataPerRow);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = dataPerRow.filter((value) => {
        const timestamp = new Date(value.timestampIn);
        return timestamp >= startDate && timestamp <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(dataPerRow);
    }
  }, [startDate, endDate, dataPerRow]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserById(space.space.createdBy!, (user) => {
          setUser(user);
        });
      } catch (error) {}
    };
    fetch();
  }, [space.space]);

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
    console.log(dataPerRow);
    console.log(outData);
  }, [dataPerRow, outData]);

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
      <Box display={"flex"} flexDirection="row">
        <Typography
          color="primary"
          textAlign="left"
          fontSize={{ xs: 24, sm: 48, lg: 48 }}
          fontWeight={600}
          p={0}
          mt={{ xs: 6, sm: 0, lg: 0 }}
          mb={2}
          ml={0}
          sx={{
            wordWrap: "break-word",
          }}
        >
          Control de acceso controlado por "{space.space?.name}"
        </Typography>
      </Box>

      <DevicesDetailsText title="Nombre" value={space.space.name} />
      <DevicesDetailsText title="Tipo" value={"Control de Acceso"} />
      <DevicesDetailsText
        title="Fecha de creación"
        value={new Date(space.space.createdOn!).toLocaleString("es-VE", {
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
        {dataPerRow && dataPerRow.length > 0 && (
          <>
            <DataGrid
              sx={{ width: "100%" }}
              rows={filteredData.map((value, index) => ({
                id: index,
                timestampIn: new Date(value.timestampIn).toLocaleString("VET", {
                  hour12: false,
                  dateStyle: "short",
                  timeStyle: "long",
                }),
                timestampOut:
                  !value.timestampOut || value.state === "Acceso denegado"
                    ? ""
                    : new Date(value.timestampOut).toLocaleString("VET", {
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
                width: 132,
              }))}
              slots={{
                toolbar: () => (
                  <CustomToolbar startDate={startDate!} endDate={endDate!} />
                ),
              }}
            />
          </>
        )}
        {dataPerRow && dataPerRow.length === 0 && (
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
                name: value.userName,
                ci: value.userCi,
                email: value.userEmail,
                eCard: value.userECard,
                career: value.userCareer,
              }))}
              columns={columnsOut.map((column) => ({
                field: column.field,
                headerName: column.headerName,
                width: 200,
              }))}
              pageSizeOptions={[5, 10, 25]}
            />
          </>
        )}
        {outData && outData.length === 0 && (
          <Typography>No hay usuarios dentro del espacio</Typography>
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
