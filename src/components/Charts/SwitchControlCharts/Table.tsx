import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { SwitchChartProps } from "../../../api/ChartData";

import {
  Box,
  Button,
  Paper,
  TableContainer,
  Typography,
  Table as TableMUI,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { useState, useEffect } from "react";
import { Device, getDeviceById } from "../../../api/Device";
import { Space, getSpaceById } from "../../../api/Space";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import DownloadDataModal from "./DownloadDataModal";

const Table = ({ spaceId, deviceId }: SwitchChartProps): JSX.Element => {
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

  const [space, setSpace] = useState<Space>();
  const [device, setDevice] = useState<Device>();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      await getSpaceById(spaceId, (space) => {
        setSpace(space);
      });
    };
    fetch();
  }, [spaceId]);

  useEffect(() => {
    const fetch = async () => {
      await getDeviceById(deviceId, (device) => {
        setDevice(device);
      });
    };
    fetch();
  }, [deviceId]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = "asc" | "desc";

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  return (
    <>
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

            m: 2,
            p: 2,
            height: "20rem",
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
                {values.map((value) => (
                  <TableRow
                    key={value.timestamp.toString()}
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
        deviceName={device?.name!}
        spaceName={space?.name!}
        startDate={values[0].timestamp}
        endDate={values[values.length - 1].timestamp}
        data={values}
        columns={columns}
      />
    </>
  );
};

export default Table;
