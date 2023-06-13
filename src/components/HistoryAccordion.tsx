import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Device } from "../api/Devices";
import { Space } from "../api/Space";
import { Fragment, useState } from "react";
import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";

interface HistoryProps {
  devices?: Device[];
  spaces?: Space[];
}

const HistoryAccordion = (): JSX.Element => {
  return <></>;
};

export default HistoryAccordion;
