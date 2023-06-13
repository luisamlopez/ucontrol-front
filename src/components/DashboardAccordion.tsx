import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { useState } from "react";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import DashboardAccordionDetails from "./DashboardAccordionDetails";

export interface AccordionProps {
  spaces: Space[];
}

const DashboardAccordion = ({ spaces }: AccordionProps): JSX.Element => {
  return (
    <>
      {spaces.map((space, i) => (
        <Accordion
          sx={{
            backgroundColor: "#ECEEEF",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
          key={i}
        >
          <AccordionSummary expandIcon={<KeyboardArrowDownRounded />}>
            <Typography>{space.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {space.devices ? (
              <>
                <DashboardAccordionDetails devices={space.devices} />
              </>
            ) : (
              <Typography> No hay dispositivos en este espacio</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default DashboardAccordion;
