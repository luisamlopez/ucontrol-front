import {
  Box,
  Button,
  Paper,
  TableContainer,
  Table as TableMUI,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Typography,
} from "@mui/material";

import { useState, useEffect } from "react";
import {
  Device,
  getDeviceById,
  getSpaceFromDeviceId,
} from "../../../api/Device";
import { Space, getSpaceById } from "../../../api/Space";
import DownloadDataModal from "./DownloadDataModal";

interface Props {
  deviceId: string;
  deviceName?: string;
}

const Table = ({ deviceId, deviceName }: Props): JSX.Element => {
  const values = [
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Encendido",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Apagado",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Encendido",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Apagado",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Encendido",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Encendido",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Apagado",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Encendido",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Apagado",
    },
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: "Encendido",
    },
  ];

  const columns = [
    { field: "timestamp", headerName: "Fecha", width: 200 },
    { field: "state", headerName: "Estado", width: 200 },
  ];

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      <Typography fontWeight={600} fontSize={24} textAlign={"center"}>
        Tabla de estados de {deviceName}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            lg: "column",
            md: "column-reverse",
            xs: "column-reverse",
            sm: "column-reverse",
          },
          p: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{
            mb: 2,
            zIndex: 1,
            placeSelf: "flex-end",
            width: {
              lg: "20%",
              md: "20%",
              xs: "100%",
              sm: "100%",
            },
            mr: {
              lg: "5",
              md: "5",
              xs: "0",
              sm: "0",
            },
          }}
          onClick={handleOpenModal}
        >
          Descargar
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mx: 2,
            p: 2,
            height: "18rem",
            width: "100%",
            //Delete horizontal scroll
            overflowX: "hidden",
            placeSelf: "center",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              placeSelf: "center",
            }}
          >
            <TableMUI size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Fecha</TableCell>
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {values.map((value, i) => (
                  <TableRow
                    key={i + value.timestamp.toString()}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {value.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">{value.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableMUI>
          </TableContainer>
        </Box>
      </Box>
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        startDate={values[0].timestamp}
        endDate={values[values.length - 1].timestamp}
        data={values}
        columns={columns}
      />
    </>
  );
};

export default Table;
