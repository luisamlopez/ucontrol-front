import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Box, Button, Paper, Typography } from "@mui/material";

import DownloadDataModal from "./DownloadDataModal";

const token =
  "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
const org = "UControl";
const url = "http://172.29.91.241:8086";

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

export const THValue = ({ deviceName, topic, deviceStartDate, values }) => {
  const [dataTemp, setDataTemp] = useState([]);
  const [dataHum, setDataHum] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  let queryT = `from(bucket: "ucontrol-arm21") 
|>  range(start: -5m, stop: 1h) 
|> filter(fn: (r) => r["_measurement"] == "measurements")
|> filter(fn: (r) =>  r["_field"] == "Temperature")
|> filter(fn: (r) => r["topic"] == "${topic}")
|> yield(name: "mean")`;

  let queryH = `from(bucket: "ucontrol-arm21")
|>  range(start: -5m, stop: 1h)
|> filter(fn: (r) => r["_measurement"] == "measurements")
|> filter(fn: (r) =>  r["_field"] == "Humidity")
|> filter(fn: (r) => r["topic"] == "${topic}")
|> yield(name: "mean")`;

  useEffect(() => {
    let resT = [];
    let resH = [];
    const influxQuery = async () => {
      //create InfluxDB client
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      //make query
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
            setDataTemp(finalData[0].data[finalData[0].data.length - 1].y);
          }
        },
        error(error) {
          console.log("temp query failed- ", error);
        },
      });
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
            setDataHum(finalData[0].data[finalData[0].data.length - 1].y);
          }
        },
        error(error) {
          console.log("hum query failed- ", error);
        },
      });
    };
    const interval = setInterval(() => {
      try {
        influxQuery();
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [dataHum, dataTemp]);

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
              Temperatura: {dataTemp} °C &nbsp;
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={600} fontSize={24}>
              Humedad: {dataHum} %
            </Typography>
          </Box>
        </Paper>
      </Box>
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        startDate={deviceStartDate}
        endDate={Date.now()}
        data={values}
        columns={columns}
        deviceName={deviceName}
      />
    </>
  );
};
