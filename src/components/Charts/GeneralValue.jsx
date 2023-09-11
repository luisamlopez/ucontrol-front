import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Box, Button, Paper, Typography } from "@mui/material";

import DownloadDataModal from "./DownloadDataModal";

const token =
  "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
const org = "UControl";
const url = "http://172.29.91.241:8086";

const columns = [
  { field: "timestamp", headerName: "Fecha", width: 200 },
  { field: "state", headerName: "Estado", width: 200 },
];

const GeneralValue = ({
  deviceName,
  topic,
  deviceStartDate,
  values,
  deviceType,
}) => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  let query = `from(bucket: "ucontrol-arm21")
  |> range(start: -5m)
  |> filter(fn: (r) => r["_measurement"] == "${topic}")
  |> filter(fn: (r) => r["_field"] == "sensorStatus")
  |> filter(fn: (r) => r["deviceType"] == "${deviceType}")`;

  useEffect(() => {
    let res = [];
    const influxQuery = async () => {
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      await queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          res.push(o);
        },
        complete() {
          let finalData = [];

          //variable is used to track if the current ID already has a key
          var exists = false;

          //nested for loops aren't ideal, this could be optimized but gets the job done
          for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < finalData.length; j++) {
              //check if the sensor ID is already in the array, if true we want to add the current data point to the array
              if (res[i]["sensor_id"] === finalData[j]["id"]) {
                exists = true;
                let point = {};
                point["x"] = res[i]["_time"];
                point["y"] = res[i]["_value"];
                finalData[j]["data"].push(point);
              }
            }
            //if the ID does not exist, create the key and append first data point to array
            if (!exists) {
              let d = {};
              d["id"] = res[i]["sensor_id"];
              d["data"] = [];
              let point = {};
              point["x"] = res[i]["_time"];
              point["y"] = res[i]["_value"];
              d["data"].push(point);
              finalData.push(d);
            }
            //need to set this back to false
            exists = false;
          }
          if (
            finalData[0]?.data[finalData[0].data.length - 1]?.y !== undefined
          ) {
            setData(finalData[0].data[finalData[0].data.length - 1].y);
          }
        },
        error(error) {
          console.log("temp query failed- ", error);
        },
      });
    };

    influxQuery();
    const interval = setInterval(() => {
      try {
        influxQuery();
      } catch (error) {}
    }, 60000);
    return () => clearInterval(interval);
  }, [query, data]);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
            {data && (
              <Typography fontWeight={600} fontSize={24}>
                {data === "1"
                  ? "Presencia detectada"
                  : "No hay presencia detectada"}
              </Typography>
            )}

            {(!data || !data[0]) && (
              <Typography
                fontWeight={600}
                fontSize={18}
                textAlign={"center"}
                sx={{ mt: 2 }}
              >
                No hay datos para mostrar
              </Typography>
            )}
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

export default GeneralValue;
