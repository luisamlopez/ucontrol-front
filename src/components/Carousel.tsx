import { Box, IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded as NavigateBefore,
  KeyboardArrowRightRounded as NavigateNext,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

type CarouselProps = {
  children: React.ReactNode[];
};

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  console.log(children);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === children.length - 1 ? 0 : prevIndex + 1
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
        {children.map((child, index) => (
          <Box
            key={index}
            sx={{
              display: `${index === activeIndex ? "block" : "none"}`,
              width: "100%",
              height: "100%",
            }}
          >
            {child}
          </Box>
        ))}
      </Box>
      <IconButton
        sx={{
          position: "absolute",
          left: "16px",
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
          right: "16px",
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

export default Carousel;
