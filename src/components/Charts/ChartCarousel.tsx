import { Box, IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded as NavigateBefore,
  KeyboardArrowRightRounded as NavigateNext,
} from "@mui/icons-material";
import { useState } from "react";
import { Device } from "../../api/Device";
import GeneralBarChartJSX from "./GeneralBarChartJSX";
import { useParams } from "react-router-dom";
import Table from "./SwitchControlCharts/Table";
import SoilValue from "./SoilCharts/SoilValue";
import Value from "./TempHumCharts/Value";
import Gauge from "./TempHumCharts/Gauge";
import { THBarChart } from "./TempHumCharts/THBarChart";
import { THLineChart } from "./TempHumCharts/THLineCHart";
import { THGauge } from "./TempHumCharts/THGauge";
import { THValue } from "./TempHumCharts/THValue";

type ChartCarouselProps = {
  device: Device;
  type?: string;
  tempHum?: boolean;
};

const ChartCarousel = ({ device }: ChartCarouselProps): JSX.Element => {
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

  const values = [
    {
      valueT: 28,
      valueH: 23,
      timestamp: new Date("2023-07-02T18:18:07.434Z"),
    },
    {
      valueT: 29.3,
      valueH: 24,
      timestamp: new Date("2023-08-02T18:18:07.434Z"),
    },
    {
      valueT: 32,
      valueH: 43.1,
      timestamp: new Date("2023-08-12T18:18:07.434Z"),
    },
  ];

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
              <THBarChart topic={device.topic} deviceName={device.name} />
            )}

            {device.type === "tempHum" && dvtType === "line" && (
              // <LineChart
              //   deviceId={device._id!}
              //   values={values}
              //   spaceId={spaceID!}
              // />
              <THLineChart topic={device.topic} deviceName={device.name} />
            )}
            {device.type === "tempHum" && dvtType === "gauge" && (
              <THGauge topic={device.topic} deviceName={device.name} />
              //<Box>Gauge</Box>
            )}

            {device.type === "tempHum" && dvtType === "value" && (
              // <Value
              //   values={values}
              //   deviceId={device._id!}
              //   deviceName={device.name}
              // />
              //  <Box>Value</Box>
              <THValue topic={device.topic} deviceName={device.name} />
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
                deviceId={device._id!}
                deviceName={device.name}
              />
            )}

            {/* Rest of the device types */}
            {device.type !== "tempHum" && device.type !== "hum" && (
              <>
                {dvtType === "bar" && (
                  <GeneralBarChartJSX
                    deviceId={device._id!}
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
                  <Table deviceId={device._id!} deviceName={device.name} />
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
