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
import { Device } from "../api/Devices";
import { Space } from "../api/Space";
import { Fragment, useState } from "react";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";

interface HistoryProps {
  devices?: Device[];
  spaces?: Space[];
}

function DeviceDetails(object: Device) {
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
        <TableCell component="th" scope="row">
          {object.name}
        </TableCell>
        <TableCell align="right">
          {object.history?.length === 0
            ? object.history[object.history?.length].updatedOn
            : object.createdOn}
        </TableCell>
        <TableCell align="right">
          {object.history?.length === 0
            ? object.history[object.history?.length].updatedBy
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
                    <TableRow key={object.id}>
                      <TableCell component="th" scope="row">
                        {history.updatedOn}
                      </TableCell>
                      <TableCell>{history.updatedBy}</TableCell>
                      <TableCell>{history.name}</TableCell>
                      <TableCell>{history.description}</TableCell>
                      <TableCell>{history.topic}</TableCell>
                      <TableCell>
                        {history.metricsAndUnits
                          ?.map((obj) => `${obj.metric} - ${obj.unit}`)
                          .join(",")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

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
        <TableCell component="th" scope="row">
          {object.name}
        </TableCell>
        <TableCell align="right">
          {object.history?.length === 0
            ? object.history[object.history?.length].updatedOn
            : object.createdOn}
        </TableCell>
        <TableCell align="right">
          {object.history?.length === 0
            ? object.history[object.history?.length].updatedBy
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
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha del cambio</TableCell>
                    <TableCell>Responsable del cambio</TableCell>
                    <TableCell>Nombre del espacio</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Ruta</TableCell>
                    <TableCell>Dispositivos!!!</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {object.history?.map((history) => (
                    <TableRow key={object.id}>
                      <TableCell component="th" scope="row">
                        {history.updatedOn}
                      </TableCell>
                      <TableCell>{history.updatedBy}</TableCell>
                      <TableCell>{history.name}</TableCell>
                      <TableCell>{history.description}</TableCell>
                      <TableCell>{history.route}</TableCell>
                      <TableCell>
                        {object.devices
                          ?.map((device) => `${device.name}`)
                          .join(",")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              {/* If it's a device or a space */}
              {devices ? "Nombre del dispositivo" : "Nombre del espacio"}
            </TableCell>
            <TableCell align="right">Fecha del cambio</TableCell>
            <TableCell align="right">Responsable del cambio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* If it's a device or a space */}
          {devices
            ? devices.map((device) => (
                <DeviceDetails key={device.id} {...device} />
              ))
            : spaces?.map((space) => (
                <SpaceDetails key={space.id} {...space} />
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistoryTable;
