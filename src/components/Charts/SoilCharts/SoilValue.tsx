import { Box, Button, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Columns, HChartProps } from "../../../api/ChartData";
import { Space, getSpaceById } from "../../../api/Space";
import { Device, getDeviceById } from "../../../api/Device";
import DownloadDataModal from "./DownloadDataModal";

const columns: Columns[] = [
  {
    field: "timestamp",
    headerName: "Fecha",
  },
  {
    field: "humidity",
    headerName: "Humedad",
  },
];

const SoilValue = ({ spaceId, deviceId, values }: HChartProps): JSX.Element => {
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

  const labels = [];
  for (let i = 0; i < values.length; i++) {
    labels.push(values[i].timestamp.toLocaleString());
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

        <Paper
          sx={{
            mb: 2,
            zIndex: 0,
            whiteSpace: "nowrap",
            width: "80%",
            placeSelf: "center",
            height: "20rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: {
              lg: "row",
              md: "row",
              xs: "column",
              sm: "column",
            },
          }}
        >
          <Box>
            <Typography fontWeight={600} fontSize={24}>
              Humedad: {values[values.length - 1].value} %
            </Typography>
          </Box>
        </Paper>
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

export default SoilValue;
