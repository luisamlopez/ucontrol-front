import { CloseRounded } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface DownloadDataModalProps {
  show: boolean;
  handleClose: () => void;
  data: any[];
  startDate: Date;
  endDate: Date;
  deviceName: string;
  spaceName: string;
}

const DownloadDataModal = ({
  show,
  handleClose,
  deviceName,
  spaceName,
  startDate: initialStartDate,
  endDate: initialEndDate,
  data,
}: DownloadDataModalProps) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

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
        const timestamp = value.timestamp;
        return timestamp >= startDate && timestamp <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [startDate, endDate, data]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: "8px",
        alignItems: "center",
        justifyContent: "center",
        m: 2,
      }}
      fullScreen
    >
      <Tooltip title="Cerrar">
        <IconButton
          onClick={handleClose}
          sx={{
            alignSelf: "flex-end",
            mb: 0.5,
          }}
        >
          <CloseRounded />
        </IconButton>
      </Tooltip>

      <DialogTitle
        fontWeight={"bold"}
        color="primary.main"
        sx={{ m: 0, py: 0 }}
      >
        Descargar datos de {deviceName} en {spaceName}
      </DialogTitle>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 2,
          p: 2,
        }}
      >
        <Typography>
          Selecciona el rango de fechas para descargar los datos
        </Typography>
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
        <DataGrid
          // rows={filteredData.map((value, index) => ({
          //   id: index,
          //   timestamp: value.timestamp,
          //   temperature: value.valueT,
          //   humidity: value.valueH,
          // }))}
          rows={filteredData.map((value, index) => ({
            id: index,
            timestamp: value.timestamp,
            temperature: value.valueT,
            humidity: value.valueH,
          }))}
          columns={[
            { field: "timestamp", headerName: "Fecha", width: 200 },
            { field: "temperature", headerName: "Temperatura", width: 200 },
            { field: "humidity", headerName: "Humedad", width: 200 },
          ]}
          slots={{
            toolbar: () => (
              <CustomToolbar
                deviceName={deviceName}
                spaceName={spaceName}
                startDate={startDate!}
                endDate={endDate!}
              />
            ),
          }}
        />
      </Box>
    </Dialog>
  );
};
export default DownloadDataModal;

function CustomToolbar({
  deviceName,
  spaceName,
  startDate,
  endDate,
}: {
  deviceName: string;
  spaceName: string;
  startDate: Date;
  endDate: Date;
}) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{
          fileName: `Datos de ${deviceName} en ${spaceName} desde ${startDate.toLocaleString(
            "es-VE",
            {
              hour12: false,
              dateStyle: "short",
              timeStyle: "short",
            }
          )} hasta ${endDate.toLocaleString("es-VE", {
            hour12: false,
            dateStyle: "short",
            timeStyle: "short",
          })}`,
          delimiter: ";",
          utf8WithBom: true,
        }}
      />
    </GridToolbarContainer>
  );
}