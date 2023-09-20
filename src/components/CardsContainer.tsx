import { Box, Grid } from "@mui/material";
import React from "react";

interface CardsContainerProps {
  children: React.ReactNode;
}

const CardsContainer = ({ children }: CardsContainerProps): JSX.Element => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {React.Children.map(children, (child, i) => (
          <Grid item key={i}>
            {child}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardsContainer;
