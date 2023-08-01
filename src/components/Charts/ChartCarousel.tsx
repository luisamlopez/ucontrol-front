import { Box, IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded as NavigateBefore,
  KeyboardArrowRightRounded as NavigateNext,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { Device } from "../../api/Device";
import { ChartDataProps } from "../../api/ChartData";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";

type ChartCarouselProps = {
  device: Device;
};

const ChartCarousel: React.FC<ChartCarouselProps> = ({
  device,
}: ChartCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const types = device.dataVisualizationType;

  const handlePrevClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? types.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === types.length - 1 ? 0 : prevIndex + 1
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
        {types.map((type, index) => (
          <Box
            key={index}
            sx={{
              display: `${index === activeIndex ? "block" : "none"}`,
              width: "100%",
              height: "100%",
            }}
          >
            {type === "bar" && (
              <BarChart id={device._id} values={device.values} />
            )}
            {type === "pie" && (
              <PieChart id={device._id} values={device.values} />
            )}
            {type === "line" && (
              <LineChart id={device._id} values={device.values} />
            )}
            {type === "gauge" && (
              // <Gauge id={device._id} values={device.values} />
              <Box>Gauge</Box>
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
        }}
        onClick={handleNextClick}
      >
        <NavigateNext />
      </IconButton>
    </Box>
  );
};

export default ChartCarousel;
