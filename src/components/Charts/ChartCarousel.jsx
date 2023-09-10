import { Box, IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded as NavigateBefore,
  KeyboardArrowRightRounded as NavigateNext,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import GeneralBarChartJSX from "./GeneralBarChartJSX";
import Table from "./SwitchControlCharts/SwitchControlTable";
import { SoilValue } from "./SoilCharts/SoilValue";
import { THBarChart } from "./TempHumCharts/THBarChart";
import { THLineChart } from "./TempHumCharts/THLineCHart";
import { THGauge } from "./TempHumCharts/THGauge";
import { THValue } from "./TempHumCharts/THValue";
import { InfluxDB } from "@influxdata/influxdb-client";
import { SoilBarChart } from "./SoilCharts/SoilBarChart";
import { SoilGauge } from "./SoilCharts/SoilGauge";
import { SoilLineChart } from "./SoilCharts/SoilLineChart";

const ChartCarousel = ({ device }) => {
  const [dataTemp, setDataTemp] = useState();
  const [dataHum, setDataHum] = useState();
  const [dataSoil, setDataSoil] = useState();
  const [dataLight, setDataLight] = useState();

  const [THValues, setTHValues] = useState([]);
  const [SoilValues, setSoilValues] = useState([]);
  const [LightValues, setLightValues] = useState([]);

  /**
   * This effect is used to query the database and get the data for the temperature and humidity charts
   */
  useEffect(() => {
    if (device.type === "tempHum") {
      const token =
        "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
      const org = "UControl";
      const url = "http://172.29.91.241:8086";
      let queryT = `from(bucket: "ucontrol-arm21") 
|>  range(start: ${device.createdOn}, stop:  ${Date.now()})
  |> filter(fn: (r) => r["_measurement"] == "${device.topic}")
  |> filter(fn: (r) => r["deviceType"] == "${device.type}")
|> filter(fn: (r) =>  r["_field"] == "temperature")
|> yield(name: "mean")`;

      let queryH = `from(bucket: "ucontrol-arm21")
|>  range(start: ${device.createdOn}, stop: ${Date.now()})
  |> filter(fn: (r) => r["_measurement"] == "${device.topic}")
  |> filter(fn: (r) => r["deviceType"] == "${device.type}")
|> filter(fn: (r) =>  r["_field"] == "humidity")
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
            if (finalData.length > 0) {
              setDataTemp(finalData);
            }
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
            if (finalData.length > 0) {
              setDataHum(finalData);
            }
          },
          error(error) {
            console.log("hum query failed- ", error);
          },
        });
      };
      influxQuery();
    }
  }, [device]);

  /**
   * This effect is used to format the data for the temperature and humidity charts
   */
  useEffect(() => {
    try {
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
    } catch {}
  }, [dataHum, dataTemp, device.type]);

  /**
   *  This effect is used to query the database and get the data for the soil moist charts
   */

  useEffect(() => {
    if (device.type === "hum") {
      const token =
        "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
      const org = "UControl";
      const url = "http://172.29.91.241:8086";

      let queryH = `from(bucket: "ucontrol-arm21")
|>  range(start: ${device.createdOn}, stop: ${Date.now()})
  |> filter(fn: (r) => r["_measurement"] == "${device.topic}")
  |> filter(fn: (r) => r["deviceType"] == "hum")
  |> filter(fn: (r) => r["_field"] == "soilValue")
|> yield(name: "mean")`;

      let resH = [];
      const influxQuery = async () => {
        //create InfluxDB client
        const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
        //make query

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
            if (finalData.length > 0) {
              setDataSoil(finalData);
            }
          },
          error(error) {
            console.log("hum query failed- ", error);
          },
        });
      };
      influxQuery();
    }
  }, [device]);

  /**
   * This effect is used to format the data for the soil moist charts
   */
  useEffect(() => {
    try {
      if (device.type === "hum" && dataSoil && dataSoil[0].data.length > 0) {
        let values = [];
        for (let i = 0; i < dataSoil[0].data.length; i++) {
          let point = {};
          point["valueH"] = dataSoil[0].data[i]["y"];
          point["timestamp"] = dataSoil[0].data[i]["x"];
          values.push(point);
        }

        setSoilValues(values);
      }
    } catch {}
  }, [dataSoil, device.type]);

  /**
   *  This effect is used to query the database and get the data for the soil moist charts
   */

  useEffect(() => {
    if (device.type === "luz") {
      const token =
        "piyiVDqu8Utmz54tMTVPLHX5AC380BPE6-pS5rpMfqDW2JPzaKFFwGLwRaj2W6HNpmUSV9mNlUshQTM4tqwLMw==";
      const org = "UControl";
      const url = "http://172.29.91.241:8086";

      let queryH = `from(bucket: "ucontrol-arm21")
|>  range(start: ${device.createdOn}, stop: ${Date.now()})
  |> filter(fn: (r) => r["_measurement"] == "${device.topic}")
  |> filter(fn: (r) => r["deviceType"] == "luz")
  |> filter(fn: (r) => r["_field"] == "switchStatus")`;

      let res = [];
      const influxQuery = async () => {
        //create InfluxDB client
        const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
        //make query

        queryApi.queryRows(queryH, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            //push rows from query into an array object
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
            if (finalData.length > 0) {
              setDataLight(finalData);
            }
          },
          error(error) {
            console.log("hum query failed- ", error);
          },
        });
      };
      influxQuery();
    }
  }, [device]);

  /**
   * This effect is used to format the data for the soil moist charts
   */
  useEffect(() => {
    try {
      if (device.type === "luz" && dataLight && dataLight[0].data.length > 0) {
        let values = [];
        for (let i = 0; i < dataLight[0].data.length; i++) {
          let point = {};
          point["state"] = dataLight[0].data[i]["y"];
          point["timestamp"] = dataLight[0].data[i]["x"];
          values.push(point);
        }

        setLightValues(values);
      }
    } catch {}
  }, [dataLight, device.type]);

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
              <THBarChart
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
                deviceType={device.type}
              />
            )}

            {device.type === "tempHum" && dvtType === "line" && (
              <THLineChart
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
                deviceType={device.type}
              />
            )}
            {device.type === "tempHum" && dvtType === "gauge" && (
              <THGauge
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
                deviceType={device.type}
              />
            )}

            {device.type === "tempHum" && dvtType === "value" && (
              <THValue
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={THValues.length > 0 ? THValues : []}
                deviceType={device.type}
              />
            )}

            {/* Humidity */}

            {device.type === "hum" && dvtType === "bar" && (
              <SoilBarChart
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={SoilValues.length > 0 ? SoilValues : []}
                deviceType={device.type}
              />
            )}
            {device.type === "hum" && dvtType === "line" && (
              <SoilLineChart
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={SoilValues.length > 0 ? SoilValues : []}
                deviceType={device.type}
              />
            )}
            {device.type === "hum" && dvtType === "gauge" && (
              <SoilGauge
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={SoilValues.length > 0 ? SoilValues : []}
                deviceType={device.type}
              />
            )}

            {device.type === "hum" && dvtType === "value" && (
              <SoilValue
                topic={device.topic}
                deviceName={device.name}
                deviceStartDate={new Date(device.createdOn)}
                values={SoilValues.length > 0 ? SoilValues : []}
                deviceType={device.type}
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
                  <Table
                    topic={device.topic}
                    deviceName={device.name}
                    values={LightValues.length > 0 ? LightValues : []}
                    deviceType={device.type}
                    deviceStartDate={new Date(device.createdOn)}
                  />
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
