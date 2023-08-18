import { Box, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { Columns, HChartProps } from "../../../api/ChartData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Space, getSpaceById } from "../../../api/Space";
import { Device, getDeviceById } from "../../../api/Device";
import DownloadDataModal from "./DownloadDataModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const SoilLineChart = ({
  spaceId,
  deviceId,
  values,
}: HChartProps): JSX.Element => {
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

  const options = {
    responsive: true,
    // Establecer el tamaño deseado para el gráfico
    maintainAspectRatio: false, // Esto permite ajustar el tamaño sin mantener la proporción
    width: 700, // Ancho en píxeles
    height: 400, // Alto en píxeles
    plugins: {
      title: {
        display: true,
        text: `Gráfico de línea de ${device?.name} en ${space?.name}`,
      },
    },
  };
  const labels = [];
  for (let i = 0; i < values.length; i++) {
    labels.push(values[i].timestamp.toLocaleString());
  }
  const data = {
    labels,
    datasets: [
      {
        label: "Humedad",
        data: values.map((value) => value.value),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

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
          }}
        >
          <Line
            data={data}
            options={options}
            updateMode="resize"
            width={700}
            height={400}
          />
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

export default SoilLineChart;
