import { Box, IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded as NavigateBefore,
  KeyboardArrowRightRounded as NavigateNext,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { Device } from "../../api/Device";
import GeneralBarChartJSX from "./GeneralBarChartJSX";
import { useParams } from "react-router-dom";
import Table from "./SwitchControlCharts/Table";
import SoilValue from "./SoilCharts/SoilValue";
import { THBarChart } from "./TempHumCharts/THBarChart";
import { THLineChart } from "./TempHumCharts/THLineCHart";
import { THGauge } from "./TempHumCharts/THGauge";
import { THValue } from "./TempHumCharts/THValue";
import { InfluxDB } from "@influxdata/influxdb-client";

const ChartCarousel = ({ device }) => {
  const [dataTemp, setDataTemp] = useState();
  const [dataHum, setDataHum] = useState();

  const [THValues, setTHValues] = useState([]);

  useEffect(() => {
    if (device.type === "tempHum") {
      const token =
        "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
      const org = "UControl";
      const url = "http://172.29.91.241:8086/";
      let queryT = `from(bucket: "ucontrol-arm21") 
|>  range(start: -5m, stop:  ${Date.now()})
|> filter(fn: (r) => r["_measurement"] == "measurements")
|> filter(fn: (r) =>  r["_field"] == "Temperature")
|> filter(fn: (r) => r["topic"] == "${device.topic}")
|> yield(name: "mean")`;

      let queryH = `from(bucket: "ucontrol-arm21")
|>  range(start: -5m, stop: ${Date.now()})
|> filter(fn: (r) => r["_measurement"] == "measurements")
|> filter(fn: (r) =>  r["_field"] == "Humidity")
|> filter(fn: (r) => r["topic"] == "${device.topic}")
|> yield(name: "mean")`;

      let resT = [];
      let resH = [];
      const influxQuery = async () => {
        //create InfluxDB client
        const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
        //make query
        queryApi.queryRows(queryT, {
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

            setDataTemp(finalData);
          },
          error(error) {
            console.log("temp query failed- ", error);
          },
        });
        queryApi.queryRows(queryH, {
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
      };
      influxQuery();
    }
  }, [device]);

  useEffect(() => {
    if (
      device.type === "tempHum" &&
      dataTemp &&
      dataHum &&
      dataTemp[0].data.length > 0 &&
      dataHum[0].data.length > 0
    ) {
      let values = [];
      for (let i = 0; i < dataTemp[0].data.length; i++) {
        let point = {};
        point["valueT"] = dataTemp[0].data[i]["y"];
        point["valueH"] = dataHum[0].data[i]["y"];
        point["timestamp"] = dataTemp[0].data[i]["x"];
        values.push(point);
      }
      setTHValues(values);
    }
  }, [dataHum, dataTemp, device.type]);

  useEffect(() => {
    console.log(THValues);
  }, [THValues]);

  const [activeIndex, setActiveIndex] = useState(0);
  const dvtTypes = device.dvt;

  const handlePrevClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? dvtTypes.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === dvtTypes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const hum = [
    {
      value: 23,
      timestamp: new Date("2023-07-02T18:18:07.434Z"),
    },
    {
      value: 24,
      timestamp: new Date("2023-08-02T18:18:07.434Z"),
    },
    {
      value: 43.1,
      timestamp: new Date("2023-08-12T18:18:07.434Z"),
    },
  ];

  return (
    <Box sx={{ position: "relative", height: "350px" }}>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
      >
        {dvtTypes.map((dvtType, index) => (
          <Box
            key={index}
            sx={{
              display: `${index === activeIndex ? "block" : "none"}`,
              width: "100%",
              height: "100%",
            }}
          >
            {/* Temperature and humidity */}
            {device.type === "tempHum" && dvtType === "bar" && (
              // <BarChart
              //   deviceId={device._id!}
              //   values={values}
              //   spaceId={spaceID!}
              // />
              <THBarChart
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
              />
            )}

            {device.type === "tempHum" && dvtType === "line" && (
              // <LineChart
              //   deviceId={device._id!}
              //   values={values}
              //   spaceId={spaceID!}
              // />
              <THLineChart
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
              />
            )}
            {device.type === "tempHum" && dvtType === "gauge" && (
              <THGauge
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
              />
              //<Box>Gauge</Box>
            )}

            {device.type === "tempHum" && dvtType === "value" && (
              // <Value
              //   values={values}
              //   deviceId={device._id!}
              //   deviceName={device.name}
              // />
              //  <Box>Value</Box>
              <THValue
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
              />
            )}

            {/* Humidity */}

            {device.type === "hum" && dvtType === "bar" && (
              // <SoilBarChart values={hum} deviceId={device._id!} deviceName={device.name}
              // />
              <Box>Bar</Box>
            )}
            {device.type === "hum" && dvtType === "line" && (
              // <SoilLineChart values={hum} deviceId={device._id!} deviceName={device.name}
              // />
              <Box>Line</Box>
            )}
            {device.type === "hum" && dvtType === "gauge" && (
              // <SoilGauge values={hum} deviceId={device._id!} deviceName={device.name}/>
              <Box>Gauge</Box>
            )}

            {device.type === "hum" && dvtType === "value" && (
              <SoilValue
                values={hum}
                deviceId={device._id}
                deviceName={device.name}
              />
            )}

            {/* Rest of the device types */}
            {device.type !== "tempHum" && device.type !== "hum" && (
              <>
                {dvtType === "bar" && (
                  <GeneralBarChartJSX
                    deviceId={device._id}
                    deviceName={device.name}
                  />
                )}
                {dvtType === "pie" && (
                  // <PieChart id={device.id} values={device.values} />
                  <Box>Pie</Box>
                )}
                {dvtType === "line" && (
                  //  <LineChart id={device.id} values={device.values} />
                  <Box>Line</Box>
                )}
                {dvtType === "gauge" && (
                  // <Gauge id={device._id} values={device.values} />
                  <Box>Gauge</Box>
                )}
                {dvtType === "table" && (
                  <Table deviceId={device._id} deviceName={device.name} />
                )}
                {dvtType === "value" && (
                  // <Value id={device._id} values={device.values} />
                  <Box>Value</Box>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
      {device.dvt.length > 1 && (
        <>
          <IconButton
            sx={{
              position: "absolute",
              left: "0px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "primary.main",
            }}
            onClick={handlePrevClick}
          >
            <NavigateBefore />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              right: "0px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "primary.main",
            }}
            onClick={handleNextClick}
          >
            <NavigateNext />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ChartCarousel;
