import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import { Columns, HChartProps } from "../../../api/ChartData";
import { Chart as ChartJS, Title, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
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
    field: "humidity",
    headerName: "Humedad",
  },
];

ChartJS.register(ArcElement, Title, Legend, legendMarginPlugin);

const SoilGauge = ({
  deviceName,
  deviceId,
  values,
}: HChartProps): JSX.Element => {
  const [openModal, setOpenModal] = useState(false);

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
        text: `Humedad de ${deviceName}`,
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
        label: "Humedad",
        data: [
          values[values.length - 1].value,
          100 - values[values.length - 1].value,
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

  const humidityValue = {
    id: `humidityValue-${deviceId}`,
    beforeDraw(chart: any) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      const humidityLabel = `Humedad: ${values[values.length - 1].value}%`;
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
          <Doughnut data={data} options={options} plugins={[humidityValue]} />
        </Paper>
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

export default SoilGauge;
