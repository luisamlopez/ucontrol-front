import { useEffect, useState } from "react";
import { Device, getDeviceById, getSpaceFromDeviceId } from "../../api/Device";
import { Space, getSpaceById } from "../../api/Space";
import DownloadDataModal from "./DownloadDataModal";
import { Box, Button, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import StreamingPlugin from "chartjs-plugin-streaming";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

interface Props {
  deviceId: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  StreamingPlugin
);

const columns = [
  { field: "timestamp", headerName: "Fecha", width: 200 },
  { field: "state", headerName: "Estado", width: 200 },
];

const GeneralBarChart = ({ deviceId }: Props): JSX.Element => {
  const [device, setDevice] = useState<Device>();
  const [space, setSpace] = useState<Space>();

  const [values, setValues] = useState<
    {
      timestamp: Date;
      value: number;
    }[]
  >([]);

  const [openModal, setOpenModal] = useState(false);

  const otherValues = [
    {
      timestamp: new Date("2021-06-01T00:00:00.000Z"),
      value: 1,
    },
    {
      timestamp: new Date("2021-06-02T00:00:00.000Z"),
      value: 0,
    },
    {
      timestamp: new Date("2021-06-03T00:00:00.000Z"),
      value: 1,
    },
    {
      timestamp: new Date("2021-06-04T00:00:00.000Z"),
      value: 0,
    },
    {
      timestamp: new Date("2021-06-10T00:00:00.000Z"), // Changed timestamp
      value: 1,
    },
    {
      timestamp: new Date("2021-06-15T00:00:00.000Z"), // Changed timestamp
      value: 1,
    },
    {
      timestamp: new Date("2021-06-20T00:00:00.000Z"), // Changed timestamp
      value: 0,
    },
    {
      timestamp: new Date("2021-06-25T00:00:00.000Z"), // Changed timestamp
      value: 1,
    },
    {
      timestamp: new Date("2021-06-30T00:00:00.000Z"), // Changed timestamp
      value: 0,
    },
    {
      timestamp: new Date("2021-07-05T00:00:00.000Z"), // Changed timestamp
      value: 1,
    },
  ];

  values.push(...otherValues);

  useEffect(() => {
    const fetch = async () => {
      await getSpaceFromDeviceId(deviceId, async (spaceId) => {
        await getSpaceById(spaceId, (space) => {
          setSpace(space);
        });
      });
    };
    fetch();
  }, [deviceId]);

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

  // use effect to increase the values array
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newValues = [...values];
  //     newValues.push({
  //       timestamp: new Date(),
  //       value: Math.floor(Math.random() * 2),
  //     });
  //     setValues(newValues);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [values]);

  const options = {
    scales: {
      x: {
        type: "realtime",
        realtime: {
          duration: 20000,
          refresh: 500,
          delay: 500,
          onRefresh: (chart: any) => {
            chart.data.datasets.forEach((dataset: any) => {
              dataset.data.push({
                x: Date.now(),
                y: Math.random(),
              });
            });
          },
        },
      },
    },
  };

  const data = {
    //labels,
    datasets: [
      {
        label: "Cantidad de presencia",
        data: [],
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
            //  options={options}
            updateMode="resize"
            width={700}
            height={400}
          />
        </Paper>
      </Box>
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        // deviceName={device?.name!}
        // spaceName={space?.name!}
        startDate={values[0].timestamp}
        endDate={values[values.length - 1].timestamp}
        data={values}
        columns={columns}
      />
    </>
  );
};

export default GeneralBarChart;
