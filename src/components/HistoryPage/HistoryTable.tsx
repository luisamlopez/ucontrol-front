import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Device } from "../../api/Device";
import { Space } from "../../api/Space";
import { Fragment, useState } from "react";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import { format } from "date-fns";

interface HistoryProps {
  devices?: Device[];
  spaces?: Space[];
}

function DeviceDetails(object: Device) {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {object.name}
        </TableCell>
        <TableCell align="center">
          {object.history?.length === 0
            ? object.history[object.history?.length].updatedOn
            : object.createdOn}
        </TableCell>
        <TableCell align="center">
          {object.history && object.history.length > 0
            ? object.history[object.history.length - 1].updatedBy
            : object.createdBy}
        </TableCell>
      </TableRow>

      {/* Details on collapse */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Historial de cambios
              </Typography>
              {/* If there's no history, don't show the table */}

              {object.history && object.history.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha del cambio</TableCell>
                      <TableCell>Responsable del cambio</TableCell>
                      <TableCell>Nombre del dispositivo</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Tópico/Espacio</TableCell>
                      <TableCell>Unidades y métricas</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {object.history?.map((history) => (
                      <TableRow key={object._id}>
                        <TableCell component="th" scope="row" align="center">
                          {history.updatedOn}
                        </TableCell>
                        <TableCell>{history.updatedBy}</TableCell>
                        <TableCell>{history.name}</TableCell>
                        <TableCell>{history.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No hay historial de cambios</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

//TODO: Fix the history table
function SpaceDetails(object: Space) {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {object.name}
        </TableCell>
        <TableCell align="center">
          {object.history?.length === 0
            ? format(
                object.history[object.history?.length].updatedOn,
                "dd/MM/yyyy"
              )
            : format(object.createdOn, "dd/MM/yyyy")}
        </TableCell>
        <TableCell align="center">
          {object.history && object.history.length > 0
            ? object.history[object.history.length - 1].updatedBy
            : object.createdBy}
        </TableCell>
      </TableRow>

      {/* Details on collapse */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Historial de cambios
              </Typography>

              {object.history && object.history.length > 0 ? (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha del cambio</TableCell>
                      <TableCell>Responsable del cambio</TableCell>
                      <TableCell>Nombre del espacio</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Dispositivos!!!</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {object.history?.map((history) => (
                      <TableRow key={object._id}>
                        <TableCell component="th" scope="row">
                          {format(history.updatedOn, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>{history.updatedBy}</TableCell>
                        <TableCell>{history.name}</TableCell>
                        <TableCell>{history.description}</TableCell>
                        <TableCell>{history.route}</TableCell>
                        <TableCell>
                          {object.devices
                            ?.map((device) => `${device.name}`)
                            .join(", ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No hay historial de cambios</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

const HistoryTable = ({ devices, spaces }: HistoryProps): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f5f5f5",
            }}
          >
            <TableCell />
            {/* Blank space */}
            <TableCell
              align="center"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {/* If it's a device or a space */}
              {devices ? "Nombre del dispositivo" : "Nombre del espacio"}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Fecha del cambio
            </TableCell>
            <TableCell
              align="center"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Responsable del cambio
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If it's a device or a space */}
          {devices
            ? devices.map((device) => (
                <DeviceDetails key={device._id} {...device} />
              ))
            : spaces?.map((space) => (
                <SpaceDetails key={space._id} {...space} />
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
