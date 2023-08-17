import { CloseRounded } from "@mui/icons-material";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
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

interface DownloadDataModalProps {
  show: boolean;
  handleClose: () => void;
  data?: any[];
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
  startDate,
  endDate,
  data,
}: DownloadDataModalProps) => {
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
              onChange={(newValue: any) => {
                //data.setStartDate(newValue);
              }}
              //   renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Hasta"
              value={endDate}
              onChange={(newValue: any) => {
                // data.setEndDate(newValue);
              }}
              //   renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <DataGrid
          rows={[
            {
              id: 1,
              timestamp: "2021-10-10 10:00:00",
              temperature: 20,
              humidity: 50,
            },
            {
              id: 2,
              timestamp: "2021-10-10 10:00:00",
              temperature: 20,
              humidity: 50,
            },
            {
              id: 3,
              timestamp: "2021-10-10 10:00:00",
              temperature: 20,
              humidity: 50,
            },
          ]}
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
                startDate={startDate}
                endDate={endDate}
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
