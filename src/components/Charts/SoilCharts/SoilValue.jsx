import { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { Box, Button, Paper, Typography } from "@mui/material";
import { orgInflux, tokenInflux, urlInflux } from "../../../api/url";

import DownloadDataModal from "./DownloadDataModal";

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

export const SoilValue = ({ deviceName, topic, deviceStartDate, values }) => {
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

  let queryH = `from(bucket: "ucontrol")
  |> range(start: -96h)
  |> filter(fn: (r) => r["_measurement"] == "${topic}")
  |> filter(fn: (r) => r["_field"] == "value")`;

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
            if (
              finalData[0] &&
              finalData[0].data[finalData[0].data.length - 1]
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
      } catch (error) { }
    };
    influxQuery();
    const interval = setInterval(() => {
      try {
        influxQuery();
      } catch (error) { }
    }, 980000);
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
            width: "80%",
            placeSelf: "center",
            height: "20rem",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
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
            <Typography fontWeight={600} fontSize={24} textAlign={"center"}>
              Humedad: {dataHum.value}%
            </Typography>
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
