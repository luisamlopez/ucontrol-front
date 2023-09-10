import {
  Box,
  Button,
  Paper,
  TableContainer,
  Table as TableMUI,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Typography,
  Switch,
} from "@mui/material";

import { useState, useEffect } from "react";
import {
  Device,
  getDeviceById,
  getSpaceFromDeviceId,
} from "../../../api/Device";
import { Space, getSpaceById } from "../../../api/Space";
import DownloadDataModal from "./DownloadDataModal";
import { InfluxDB } from "@influxdata/influxdb-client";

const token =
  "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
const org = "UControl";
const url = "http://172.29.91.241:8086";

const Table = ({ topic, deviceName, deviceType, values, deviceStartDate }) => {
  const columns = [
    { field: "timestamp", headerName: "Fecha", width: 200 },
    { field: "state", headerName: "Estado", width: 200 },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  let query = `from(bucket: "ucontrol-arm21")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "${topic}")
  |> filter(fn: (r) => r["_field"] == "switchStatus")
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

          setData(finalData);
        },
        error(error) {
          console.log("temp query failed- ", error);
        },
      });
    };

    const interval = setInterval(() => {
      try {
        influxQuery();
      } catch (error) {}
    }, 10000);
    return () => clearInterval(interval);
  }, [query, data]);

  return (
    <>
      {data && data.length > 0 && (
        <>
          {(deviceType === "luz" || deviceType === "aire") && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  fontWeight={600}
                  fontSize={16}
                  textAlign={"center"}
                  m={2}
                >
                  Controlar estado de {deviceName}
                </Typography>
                <Typography fontWeight={600} fontSize={14} textAlign={"center"}>
                  OFF
                </Typography>
                <Switch checked={checked} onChange={handleChange} />
                <Typography fontWeight={600} fontSize={14} textAlign={"center"}>
                  ON
                </Typography>
              </Box>
            </>
          )}
          <>
            <Typography fontWeight={600} fontSize={18} textAlign={"center"}>
              Tabla de estados de {deviceName}
            </Typography>
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

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: 2,
                  p: 2,
                  height: "20rem",
                  width: "100%",
                  //Delete horizontal scroll
                  overflowX: "hidden",
                  placeSelf: "center",
                }}
              >
                <TableContainer
                  component={Paper}
                  sx={{
                    placeSelf: "center",
                  }}
                >
                  <TableMUI size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Fecha</TableCell>
                        <TableCell align="center">Estado</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data[0].data.reverse().map((value, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center" component="th" scope="row">
                            {new Date(value.x).toLocaleString("es-VE", {
                              hour12: false,
                              dateStyle: "short",
                              timeStyle: "long",
                            })}
                          </TableCell>
                          <TableCell align="center">
                            {value.y === "1" ? "Encendido" : "Apagado"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableMUI>
                </TableContainer>
              </Box>
            </Box>
          </>
        </>
      )}
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        startDate={deviceStartDate}
        endDate={Date.now()}
        data={values}
        columns={columns}
      />
    </>
  );
};

export default Table;
