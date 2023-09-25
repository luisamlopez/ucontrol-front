import { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Box, Button, Paper, Typography } from "@mui/material";
import { orgInflux, tokenInflux, urlInflux } from "../../../api/url";

import "chartjs-adapter-luxon";

import { Chart as ChartJS, Title, Legend, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import DownloadDataModal from "./DownloadDataModal";

const legendMarginPlugin = {
  id: "legendMargin",
  beforeInit: (chart) => {
    const originalFit = chart.legend.fit;

    chart.legend.fit = function () {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
};

ChartJS.register(ArcElement, Title, Legend, legendMarginPlugin);

const token = tokenInflux;
const org = orgInflux;
const url = urlInflux;

const columns = [
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

export const THGauge = ({ deviceName, topic, deviceStartDate, values }) => {
  const [dataTemp, setDataTemp] = useState({
    value: 0,
    timestamp: new Date(Date.now()),
  });
  const [dataHum, setDataHum] = useState({
    value: 0,
    timestamp: new Date(Date.now()),
  });
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  let queryT = `from(bucket: "ucontrol") 
|> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "${topic} / Temperatura")
  |> filter(fn: (r) => r["_field"] == "value")`;

  let queryH = `from(bucket: "ucontrol")
|> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "${topic} / Humedad")
  |> filter(fn: (r) => r["_field"] == "value")`;

  useEffect(() => {
    let resT = [];
    let resH = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      //make query
      try {
        await queryApi.queryRows(queryT, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            //push rows from query into an array object
            resT.push(o);
          },
          complete() {
            let finalData = [];

            //variable is used to track if the current ID already has a key
            var exists = false;

            //nested for loops aren't ideal, this could be optimized but gets the job done
            for (let i = 0; i < resT.length; i++) {
              for (let j = 0; j < finalData.length; j++) {
                //check if the sensor ID is already in the array, if true we want to add the current data point to the array
                if (resT[i]["sensor_id"] === finalData[j]["id"]) {
                  exists = true;
                  let point = {};
                  point["x"] = resT[i]["_time"];
                  point["y"] = resT[i]["_value"];
                  finalData[j]["data"].push(point);
                }
              }
              //if the ID does not exist, create the key and append first data point to array
              if (!exists) {
                let d = {};
                d["id"] = resT[i]["sensor_id"];
                d["data"] = [];
                let point = {};
                point["x"] = resT[i]["_time"];
                point["y"] = resT[i]["_value"];
                d["data"].push(point);
                finalData.push(d);
              }
              //need to set this back to false
              exists = false;
            }

            if (
              finalData[0]?.data[finalData[0].data.length - 1]?.y !== undefined
            ) {
              setDataTemp({
                value: finalData[0].data[finalData[0].data.length - 1].y,
                timestamp: finalData[0].data[finalData[0].data.length - 1].x,
              });
            }
          },
          error(error) {
            console.log("temp query failed- ", error);
          },
        });
      } catch (error) {}
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
            if (
              finalData[0]?.data[finalData[0].data.length - 1]?.y !== undefined
            ) {
              setDataHum({
                value: finalData[0].data[finalData[0].data.length - 1].y,
                timestamp: finalData[0].data[finalData[0].data.length - 1].x,
              });
            }
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
    }, 980000);
    return () => clearInterval(interval);
  }, [dataHum, dataTemp, queryH, queryT]);

  const options = {
    responsive: true,
    // Establecer el tamaño deseado para el gráfico
    maintainAspectRatio: false, // Esto permite ajustar el tamaño sin mantener la proporción
    width: 700, // Ancho en píxeles
    height: 400, // Alto en píxeles
    plugins: {
      title: {
        display: true,
        text: `Temperatura y Humedad de ${deviceName}`,
      },
    },
    backgroundColor: "white",
    cutout: "70%",
  };

  function getGradient(chart, type) {
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

  const dataSet = {
    datasets: [
      {
        label: "Temperatura",
        //get data from the array of objects where the field is temperature.
        data: [dataTemp.value, 45 - dataTemp.value],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        backgroundColor: (context) => {
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
        data: [dataHum.value, 100 - dataHum.value],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        backgroundColor: (context) => {
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
          <Doughnut data={dataSet} options={options} width={200} height={200} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 0,
              placeSelf: "center",
              mt: -12,
            }}
          >
            <Box>
              <Typography fontWeight={600} fontSize={18} textAlign={"center"}>
                Temperatura: {dataTemp.value}°C &nbsp;
              </Typography>
            </Box>
            <Box>
              <Typography fontWeight={600} fontSize={18} textAlign={"center"}>
                Humedad: {dataHum.value}%
              </Typography>
            </Box>
            <Typography fontWeight={400} fontSize={16} textAlign={"center"}>
              Fecha y hora:{" "}
              {new Date(dataHum.timestamp).toLocaleString("es-VE", {
                hour12: false,
                dateStyle: "short",
                timeStyle: "short",
              })}
            </Typography>
          </Box>
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
