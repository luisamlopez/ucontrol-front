import { CloseRounded } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
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
import { Columns } from "../../../api/ChartData";

interface DownloadDataModalProps {
  show: boolean;
  handleClose: () => void;
  columns: Columns[];
  data: any[];
  startDate: Date;
  endDate: Date;
  deviceName: string;
}

const DownloadDataModal = ({
  show,
  handleClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  data,
  columns,
  deviceName,
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
        Descargar datos de {deviceName} {data.length > 0 && "hola"}
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
          rows={data.map((value, index) => ({
            id: index,
            timestamp: new Date(value.timestamp).toLocaleString("es-VE", {
              hour12: false,
              dateStyle: "short",
              timeStyle: "short",
            }),
            temperature: Math.round(value.valueT * 100) / 100,
            humidity: Math.round(value.valueH * 100) / 100,
          }))}
          columns={columns.map((column) => ({
            field: column.field,
            headerName: column.headerName,
            width: 200,
          }))}
          slots={{
            toolbar: () => (
              <CustomToolbar
                startDate={startDate!}
                endDate={endDate!}
                deviceName={deviceName}
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
  startDate,
  endDate,
  deviceName,
}: {
  startDate: Date;
  endDate: Date;
  deviceName: string;
}) {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{
          fileName: `Datos de ${deviceName} desde ${startDate.toLocaleString(
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
