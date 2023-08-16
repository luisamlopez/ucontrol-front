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
import { useState, useRef, useEffect } from "react";
import { THChartProps } from "../../../api/ChartData";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Space, getSpaceById } from "../../../api/Space";
import { Device, getDeviceById } from "../../../api/Device";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const downloadOptions = ["Descargar CSV", "Descargar PDF"];

const LineChart = ({
  spaceId,
  deviceId,
  values,
}: THChartProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [boxMarginBottom, setBoxMarginBottom] = useState(0);
  const [space, setSpace] = useState<Space>();
  const [device, setDevice] = useState<Device>();

  useEffect(() => {
    const fetch = async () => {
      await getSpaceById(spaceId, (space) => {
        setSpace(space);
      });
    };
    fetch();
  }, [spaceId]);

  useEffect(() => {
    const fetch = async () => {
      await getDeviceById(deviceId, (device) => {
        setDevice(device);
      });
    };
    fetch();
  }, [deviceId]);

  const options = {
    responsive: true,
    // Establecer el tamaño deseado para el gráfico
    maintainAspectRatio: false, // Esto permite ajustar el tamaño sin mantener la proporción
    width: 700, // Ancho en píxeles
    height: 400, // Alto en píxeles
    plugins: {
      title: {
        display: true,
        text: `Gráfico de línea de ${device?.name} en ${space?.name}`,
      },
    },
  };
  const labels = [];
  for (let i = 0; i < values.length; i++) {
    labels.push(values[i].timestamp.toLocaleString());
  }
  const data = {
    labels,
    datasets: [
      {
        label: "Temperatura",
        data: values.map((value) => value.valueT),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Humedad",
        data: values.map((value) => value.valueH),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const handleClick = () => {
    console.info(`You clicked ${downloadOptions[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    setBoxMarginBottom(0);
    alert("Descargando " + downloadOptions[index]);
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
        <Button onClick={handleClick}>{downloadOptions[selectedIndex]}</Button>
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
                  {downloadOptions.map((option, index) => (
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
      {/* Chart */}
      <Paper
        sx={{
          mb: 2,
          zIndex: 0,
          whiteSpace: "nowrap",
          width: "90%",
          placeSelf: "center",
        }}
      >
        <Line
          data={data}
          options={options}
          updateMode="resize"
          width={700}
          height={400}
        />
      </Paper>
    </Box>
  );
};

export default LineChart;
