import { Box, IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded as NavigateBefore,
  KeyboardArrowRightRounded as NavigateNext,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Device } from "../../api/Device";
import { ChartDataProps } from "../../api/ChartData";

import BarChart from "./TempHumCharts/BarChart";
import { useParams } from "react-router-dom";
import LineChart from "./TempHumCharts/LineChart";
import Gauge from "./TempHumCharts/Gauge";

type ChartCarouselProps = {
  device: Device;
  type?: string;
};

const NumericChart = ({ device, type }: ChartCarouselProps): JSX.Element => {
  const spaceID = useParams<{ spaceID: string }>().spaceID;
  const values = [
    {
      valueT: 28,
      valueH: 23,
      timestamp: new Date("2023-08-02T18:18:07.434Z"),
    },
    {
      valueT: 29,
      valueH: 24,
      timestamp: new Date("2023-08-02T18:18:07.434Z"),
    },
    {
      valueT: 32,
      valueH: 43,
      timestamp: new Date("2023-08-02T18:18:07.434Z"),
    },
  ];
  return (
    <Box>
      {type === "bar" && (
        <BarChart deviceId={device._id!} values={values} spaceId={spaceID!} />
      )}
      {type === "line" && (
        <LineChart deviceId={device._id!} values={values} spaceId={spaceID!} />
      )}
      {type === "gauge" && (
        <Gauge deviceId={device._id!} values={values} spaceId={spaceID!} />
        //   <Box>Gauge</Box>
      )}

      {type === "value" && (
        // <Value deviceId={device._id!} values={values} spaceId={spaceID!} />
        <Box>Value</Box>
      )}
    </Box>
  );
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
        {dvtTypes.map((type, index) => (
          <Box
            key={index}
            sx={{
              display: `${index === activeIndex ? "block" : "none"}`,
              width: "100%",
              height: "100%",
            }}
          >
            {(device.type === "tempHum" || device.type === "hum") && (
              <NumericChart device={device} type={type} />
            )}
            {device.type !== "tempHum" && device.type !== "hum" && (
              <>
                {type === "bar" && (
                  // <BarChart id={device.id} values={device.values} />

                  <Box>Bar</Box>
                )}
                {type === "pie" && (
                  // <PieChart id={device.id} values={device.values} />
                  <Box>Pie</Box>
                )}
                {type === "line" && (
                  //  <LineChart id={device.id} values={device.values} />
                  <Box>Line</Box>
                )}
                {type === "gauge" && (
                  // <Gauge id={device._id} values={device.values} />
                  <Box>Gauge</Box>
                )}
                {type === "table" && (
                  // <Table id={device._id} values={device.values} />
                  <Box>Table</Box>
                )}
                {type === "value" && (
                  // <Value id={device._id} values={device.values} />
                  <Box>Value</Box>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
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
    </Box>
  );
};

export default ChartCarousel;
