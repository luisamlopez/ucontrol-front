import { Box, Button, Paper } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Columns, THChartProps } from "../../../api/ChartData";
import { Chart as ChartJS, Title, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Space, getSpaceById } from "../../../api/Space";
import { Device, getDeviceById } from "../../../api/Device";
import DownloadDataModal from "./DownloadDataModal";

const legendMarginPlugin = {
  id: "legendMargin",
  beforeInit: (chart: any) => {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function () {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
};
const columns: Columns[] = [
  {
    field: "timestamp",
    headerName: "Fecha",
  },
  {
    field: "temperature",
    headerName: "Temperatura",
  },
  {
    field: "humidity",
    headerName: "Humedad",
  },
];
ChartJS.register(ArcElement, Title, Legend, legendMarginPlugin);

const Gauge = ({ spaceId, deviceId, values }: THChartProps): JSX.Element => {
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
        text: `Temperatura y Humedad de ${device?.name} en ${space?.name}`,
      },
    },
    backgroundColor: "white",
    cutout: "70%",
  };

  function getGradient(chart: any, type: string) {
    const {
      ctx,
      chartArea: { left, right },
    } = chart;
    const gradientSegment = ctx.createLinearGradient(left, 0, right, 0);
    if (type === "temperature") {
      gradientSegment.addColorStop(0, "#40B4E5"); //blue
      gradientSegment.addColorStop(0.5, "#FFC526"); //yellow
      gradientSegment.addColorStop(1, "#FF0000"); //red
    } else {
      gradientSegment.addColorStop(0, "#FF0000"); //red
      gradientSegment.addColorStop(0.5, "#FFC526"); //yellow
      gradientSegment.addColorStop(1, "#40B4E5"); //blue
    }
    return gradientSegment;
  }

  const data = {
    datasets: [
      {
        label: "Temperatura",
        data: [
          values[values.length - 1].valueT,
          45 - values[values.length - 1].valueT,
        ],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { chartArea } = chart;
          if (!chartArea) {
            // This case happens on initial chart load
            return null;
          }
          if (context.dataIndex === 0) {
            return getGradient(chart, "temperature");
          } else {
            return "#FFFFFF";
          }
        },
        hoverOffset: 10,
      },
      {
        label: "Humedad",
        data: [
          values[values.length - 1].valueH,
          100 - values[values.length - 1].valueH,
        ],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { chartArea } = chart;
          if (!chartArea) {
            // This case happens on initial chart load
            return null;
          }

          if (context.dataIndex === 0) {
            return getGradient(chart, "humidity");
          } else {
            return "#FFFFFF";
          }
        },
        hoverOffset: -20,
      },
    ],
  };

  const temperatureValue = {
    id: `temperatureValue-${spaceId}-${deviceId}`,
    beforeDraw(chart: any) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      const temperatureLabel = `Temperatura: ${
        values[values.length - 1].valueT
      }°C`;
      ctx.fillStyle = "black"; // Set the color for the label
      ctx.font = "bold 16px Arial"; // Set the font style for the label
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(temperatureLabel, left + width / 2, top + height - 80);
    },
  };

  const humidityValue = {
    id: `humidityValue-${spaceId}-${deviceId}`,
    beforeDraw(chart: any) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      const humidityLabel = `Humedad: ${values[values.length - 1].valueH}%`;
      ctx.fillStyle = "black"; // Set the color for the label
      ctx.font = "bold 16px Arial"; // Set the font style for the label
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(humidityLabel, left + width / 2, top + height - 60);
    },
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
          {/* <IconButton>
            <KeyboardArrowDownRounded fontSize="medium" htmlColor="#FFFFFF" />
          </IconButton> */}
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
          <Doughnut
            data={data}
            options={options}
            plugins={[temperatureValue, humidityValue]}
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

export default Gauge;
