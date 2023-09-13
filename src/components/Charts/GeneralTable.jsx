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
} from "@mui/material";

import { useState, useEffect } from "react";
import DownloadDataModal from "./DownloadDataModal";
import { InfluxDB } from "@influxdata/influxdb-client";
import { orgInflux, tokenInflux, urlInflux } from "../../api/url";

const token = tokenInflux;
const org = orgInflux;
const url = urlInflux;

const GeneralTable = ({
  topic,
  deviceName,
  deviceType,
  values,
  deviceStartDate,
}) => {
  const columns = [
    { field: "timestamp", headerName: "Fecha", width: 200 },
    { field: "state", headerName: "Estado", width: 200 },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState([]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  let query = `from(bucket: "ucontrol")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "${topic}")
  |> filter(fn: (r) => r["_field"] == "value")`;

  useEffect(() => {
    let res = [];
    const influxQuery = async () => {
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
      try {
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
      } catch (error) {}
    };

    influxQuery();
    const interval = setInterval(() => {
      try {
        influxQuery();
      } catch (error) {}
    }, 60000);
    return () => clearInterval(interval);
  }, [query]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
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
          {data && data[0] && data[0].data && data[0].data.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mx: 2,
                p: 2,
                height: "25rem",
                width: "95%",
                //Delete horizontal scroll
                overflowX: "hidden",
                placeSelf: "center",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  placeSelf: "center",
                  alignSelf: "flex-start",
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
                          {value.y === 1
                            ? "Presencia detectada"
                            : "No hay presencia detectada"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableMUI>
              </TableContainer>
            </Box>
          )}

          {(!data || !data[0] || data[0].data.length === 0) && (
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
      </>
      <DownloadDataModal
        show={openModal}
        handleClose={handleCloseModal}
        startDate={deviceStartDate}
        endDate={new Date(Date.now())}
        data={values}
        columns={columns}
      />
    </>
  );
};

export default GeneralTable;
