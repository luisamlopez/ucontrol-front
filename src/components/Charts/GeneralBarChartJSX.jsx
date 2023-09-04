import { useState } from "react";
import DownloadDataModal from "./DownloadDataModal";
import { Box, Button, Paper } from "@mui/material";

import { Bar } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import Chart from "chart.js/auto";
import StreamingPlugin from "chartjs-plugin-streaming";

Chart.register(StreamingPlugin);

const columns = [
  { field: "timestamp", headerName: "Fecha", width: 200 },
  { field: "state", headerName: "Estado", width: 200 },
];

const GeneralBarChartJSX = ({ deviceId, deviceName }) => {
  const [values, setValues] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const otherValues = [
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      state: 1,
    },
    {
      timestamp: new Date("2021-06-02T00:00:00.000Z"),
      state: 0,
    },
    {
      timestamp: new Date("2021-06-03T00:00:00.000Z"),
      state: 1,
    },
    {
      timestamp: new Date("2021-06-04T00:00:00.000Z"),
      state: 0,
    },
    {
      timestamp: new Date("2021-06-10T00:00:00.000Z"), // Changed timestamp
      state: 1,
    },
    {
      timestamp: new Date("2021-06-15T00:00:00.000Z"), // Changed timestamp
      state: 1,
    },
    {
      timestamp: new Date("2021-06-20T00:00:00.000Z"), // Changed timestamp
      state: 0,
    },
    {
      timestamp: new Date("2021-06-25T00:00:00.000Z"), // Changed timestamp
      state: 1,
    },
    {
      timestamp: new Date("2021-06-30T00:00:00.000Z"), // Changed timestamp
      state: 0,
    },
    {
      timestamp: new Date("2021-07-05T00:00:00.000Z"), // Changed timestamp
      state: 1,
    },
  ];

  values.push(...otherValues);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  /**
   * Chart config
   */

  const data = {
    datasets: [
      {
        label: "Cantidad de presencia detectadas",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderDash: [8, 4],
        fill: true,
        data: [],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "realtime",
        realtime: {
          delay: 2000,
          duration: 10000,
          onRefresh: (chart) => {
            chart.data.datasets.forEach((dataset) => {
              dataset.data.push({
                /**
                 * @todo Get the influx data from the API instead of random
                 */
                x: Date.now(),
                /**
                 * @todo Here I need to have how many times a day the device returned only 1
                 * so I need the sum of the values of the day
                 */
                y: Math.floor(Math.random() * 2),
              });
            });
          },
        },
      },
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
              xs: 0,
              sm: 0,
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
          <Bar
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
        startDate={values[0].timestamp}
        endDate={values[values.length - 1].timestamp}
        data={otherValues}
        columns={columns}
      />
    </>
  );
};

export default GeneralBarChartJSX;
