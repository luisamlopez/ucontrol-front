import { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Box, Button, Paper } from "@mui/material";
import { orgInflux, tokenInflux, urlInflux } from "../../../api/url";

import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
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
import StreamingPlugin from "chartjs-plugin-streaming";
import DownloadDataModal from "./DownloadDataModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  StreamingPlugin
);

const token = tokenInflux;
const org = orgInflux;
const url = urlInflux;

const columns = [
  {
    field: "timestamp",
    headerName: "Fecha",
  },
  {
    field: "humidity",
    headerName: "Humedad",
  },
];
export const SoilLineChart = ({
  deviceName,
  topic,
  deviceStartDate,
  values,
  deviceType,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [dataHum, setDataHum] = useState([]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  let queryH = `from(bucket: "ucontrol-arm21")
  |> range(start: -5m, stop: 1h)
  |> filter(fn: (r) => r["_measurement"] == "${topic}")
  |> filter(fn: (r) => r["deviceType"] == "${deviceType}")
  |> filter(fn: (r) => r["_field"] == "soilValue")
  |> yield(name: "mean")`;

  const dataSet = {
    labels: dataHum[0]?.data.map((value) => new Date(value.x).toLocaleString()),
    datasets: [
      {
        label: "Humedad",
        data: dataHum[0]?.data.map((value) => value.y),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  useEffect(() => {
    let resH = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      //make query

      try {
        await queryApi.queryRows(queryH, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            //push rows from query into an array object
            resH.push(o);
          },
          complete() {
            let finalData = [];

            //variable is used to track if the current ID already has a key
            var exists = false;

            //nested for loops aren't ideal, this could be optimized but gets the job done
            for (let i = 0; i < resH.length; i++) {
              for (let j = 0; j < finalData.length; j++) {
                //check if the sensor ID is already in the array, if true we want to add the current data point to the array
                if (resH[i]["sensor_id"] === finalData[j]["id"]) {
                  exists = true;
                  let point = {};
                  point["x"] = resH[i]["_time"];
                  point["y"] = resH[i]["_value"];
                  finalData[j]["data"].push(point);
                }
              }
              //if the ID does not exist, create the key and append first data point to array
              if (!exists) {
                let d = {};
                d["id"] = resH[i]["sensor_id"];
                d["data"] = [];
                let point = {};
                point["x"] = resH[i]["_time"];
                point["y"] = resH[i]["_value"];
                d["data"].push(point);
                finalData.push(d);
              }
              //need to set this back to false
              exists = false;
            }

            setDataHum(finalData);
          },
          error(error) {
            console.log("hum query failed- ", error);
          },
        });
      } catch (error) {}
    };
    influxQuery();
    const interval = setInterval(() => {
      try {
        influxQuery();
      } catch (error) {}
    }, 60000);
    return () => clearInterval(interval);
  }, [dataHum, queryH]);

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
            width: "90%",
            placeSelf: "center",
            height: "25rem",
          }}
        >
          <Line data={dataSet} width={2500} height={1500} />
        </Paper>
      </Box>
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        startDate={deviceStartDate}
        endDate={new Date(Date.now())}
        data={values}
        columns={columns}
        deviceName={deviceName}
      />
    </>
  );
};
