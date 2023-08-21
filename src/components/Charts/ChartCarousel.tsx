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

type ChartCarouselProps = {
  device: Device;
  type?: string;
  tempHum?: boolean;
};

const NumericChart = ({
  device,
  type,
  tempHum,
}: ChartCarouselProps): JSX.Element => {
  const spaceID = useParams<{ spaceID: string }>().spaceID;
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
    <>
      {tempHum && (
        <Box>
          {type === "bar" && (
            // <BarChart
            //   deviceId={device._id!}
            //   values={values}
            //   spaceId={spaceID!}
            // />
            <Box>Bar</Box>
          )}
          {type === "line" && (
            // <LineChart
            //   deviceId={device._id!}
            //   values={values}
            //   spaceId={spaceID!}
            // />
            <Box>Line</Box>
          )}
          {type === "gauge" && (
            // <Gauge deviceId={device._id!} values={values} spaceId={spaceID!} />
            <Box>Gauge</Box>
          )}

          {type === "value" && (
            // <Value deviceId={device._id!} values={values} spaceId={spaceID!} />
            <Box>Value</Box>
          )}
        </Box>
      )}
      {!tempHum && (
        <Box>
          {type === "bar" && (
            // <SoilBarChart
            //   deviceId={device._id!}
            //   values={hum}
            //   spaceId={spaceID!}
            // />
            <Box>Bar</Box>
          )}
          {type === "line" && (
            // <SoilLineChart
            //   deviceId={device._id!}
            //   values={hum}
            //   spaceId={spaceID!}
            // />
            <Box>Line</Box>
          )}
          {type === "gauge" && (
            // <SoilGauge deviceId={device._id!} values={hum} spaceId={spaceID!} />
            <Box>Gauge</Box>
          )}

          {type === "value" && (
            // <SoilValue deviceId={device._id!} values={hum} spaceId={spaceID!} />
            <Box>Value</Box>
          )}
        </Box>
      )}
    </>
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
            {device.type === "tempHum" && (
              <Box>tempHum</Box>
              // <NumericChart device={device} type={type} tempHum={true} />
            )}
            {device.type === "hum" && (
              <Box>hum</Box>
              // <NumericChart device={device} type={type} tempHum={false} />
            )}
            {device.type !== "tempHum" && device.type !== "hum" && (
              <>
                {type === "bar" && (
                  <GeneralBarChartJSX deviceId={device._id!} />
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
                {type === "table" && <Table deviceId={device._id!} />}
                {type === "value" && (
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
