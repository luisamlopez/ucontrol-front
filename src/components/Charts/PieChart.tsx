import { KeyboardArrowDownRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { useState, useRef } from "react";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  PieSeries,
  Legend,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { ChartData } from "../../api/ChartData";
import { EventTracker } from "@devexpress/dx-react-chart";

/**
 * Opciones del menú desplegable. Cuando se seleccione una opción, aparecerá un modal para elegir el rango de datos a descargar.
 */
const options = ["Descargar CSV", "Descargar PDF"];

const PieChart = ({ id, data }: ChartData): JSX.Element => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [boxMarginBottom, setBoxMarginBottom] = useState(0);
  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    setBoxMarginBottom(0);
    alert("Descargando " + options[index]);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    setBoxMarginBottom(0);
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          lg: "column",
          md: "column-reverse",
          xs: "column-reverse",
          sm: "column-reverse",
        },
        p: 1,
        mb: boxMarginBottom,
      }}
      key={id}
    >
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        sx={{
          alignSelf: "flex-end",
          mb: 2,
        }}
      >
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={() => {
            setBoxMarginBottom(8);
            handleToggle();
          }}
        >
          <KeyboardArrowDownRounded />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <Paper
        sx={{
          mb: 2,
          zIndex: 0,
        }}
      >
        <Chart data={data} height={250}>
          <Legend />
          <PieSeries valueField="value" argumentField="argument" />
          <EventTracker />
          <Tooltip />
        </Chart>
      </Paper>
    </Box>
  );
};

export default PieChart;
