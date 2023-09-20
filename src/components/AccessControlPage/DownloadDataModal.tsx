import { CloseRounded } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Dialog,
  DialogContent,
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

interface DownloadDataModalProps {
  show: boolean;
  handleClose: () => void;
  columns: any[];
  data: any[];
  startDate: Date;
  endDate: Date;
}

const DownloadDataModal = ({
  show,
  handleClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  data,
  columns,
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
        const timestamp = new Date(value.timestampIn);
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
        Descargar datos
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          m: 2,
          p: 2,
          placeSelf: "center",
          width: {
            xs: "350px",
            sm: "350px",
            md: "80%",
            lg: "85%",
          },
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
        {data && data.length > 0 && (
          <DataGrid
            sx={{ width: "100%" }}
            rows={filteredData.map((value, index) => ({
              id: index,
              timestampIn: new Date(value.timestampIn).toLocaleString("VET", {
                hour12: false,
                dateStyle: "short",
                timeStyle: "long",
              }),
              timestampOut: value.timestampOut
                ? new Date(value.timestampOut).toLocaleString("VET", {
                    hour12: false,
                    dateStyle: "short",
                    timeStyle: "long",
                  })
                : value.state === "Acceso denegado"
                ? "Acceso denegado"
                : "Salida no registrada",
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
              width: 100,
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
      </DialogContent>
    </Dialog>
  );
};
export default DownloadDataModal;

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
            timeStyle: "short",
          })} hasta ${endDate.toLocaleString("es-VE", {
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
