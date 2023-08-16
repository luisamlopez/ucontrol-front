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
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Space, getSpaceById } from "../../../api/Space";
import { Device, getDeviceById } from "../../../api/Device";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const downloadOptions = ["Descargar CSV", "Descargar PDF"];

const Gauge = ({ spaceId, deviceId, values }: THChartProps): JSX.Element => {
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

  const temperatureOptions = {
    responsive: true,
    // Establecer el tamaño deseado para el gráfico
    maintainAspectRatio: false, // Esto permite ajustar el tamaño sin mantener la proporción
    width: 700, // Ancho en píxeles
    height: 400, // Alto en píxeles
    plugins: {
      title: {
        display: true,
        text: `Temperatura de ${device?.name} en ${space?.name}`,
      },
    },
  };

  const humidityOptions = {
    responsive: true,
    // Establecer el tamaño deseado para el gráfico
    maintainAspectRatio: false, // Esto permite ajustar el tamaño sin mantener la proporción
    width: 700, // Ancho en píxeles
    height: 400, // Alto en píxeles
    plugins: {
      title: {
        display: true,
        text: `Humedad de ${device?.name} en ${space?.name}`,
      },
    },
  };

  const temperatureLabels = [];
  for (let i = 0; i < values.length; i++) {
    temperatureLabels.push(values[i].timestamp.toLocaleString());
  }

  function getGradient(chart: any) {
    const {
      ctx,
      chartArea: { top, bottom, left, right },
    } = chart;
    const gradientSegment = ctx.createLinearGradient(left, 0, right, 0);
    gradientSegment.addColorStop(0, "#FF0000"); //red
    gradientSegment.addColorStop(0.5, "#FFC526"); //yellow
    gradientSegment.addColorStop(1, "#047732"); //green
    return gradientSegment;
  }

  const temperatureData = {
    //temperatureLabels,
    datasets: [
      {
        label: "Temperatura",
        data: values.map((value) => value.valueT),
        circumference: 180,
        rotation: 270,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            // This case happens on initial chart load
            return null;
          }
          if (context.datsIndex === 0) {
            return getGradient(chart);
          }
        },
      },

      //   {
      //     label: "Humedad",
      //     data: values.map((value) => value.valueH),
      //     borderColor: "rgb(53, 162, 235)",
      //     backgroundColor: "rgba(53, 162, 235, 0.5)",
      //   },
    ],
  };
  const humidityData = {
    //temperatureLabels,
    datasets: [
      {
        label: "Humedad",
        data: values.map((value) => value.valueH),
        circumference: 180,
        rotation: 270,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            // This case happens on initial chart load
            return null;
          }
          if (context.datsIndex === 0) {
            return getGradient(chart);
          }
        },
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
  const temperatureValue = {
    id: `temperatureValue-${spaceId}-${deviceId}`,
    beforeDatasetDraw(chart: any, args: any, pluginOptions: any) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      ctx.fillStyle = "primary.main";
      ctx.font = "bold 50px";
      ctx.textAlign = "center";
      ctx.fillText(
        values[values.length - 1].valueT + "°C",
        left + width / 2,
        top + height - 10
      );
      ctx.restore();
    },
  };

  const humidityValue = {
    id: `humidityValue-${spaceId}-${deviceId}`,
    beforeDatasetDraw(chart: any, args: any, pluginOptions: any) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      ctx.fillStyle = "primary.main";
      ctx.font = "bold 50px";
      ctx.textAlign = "center";
      ctx.fillText(
        values[values.length - 1].valueH + "%",
        left + width / 2,
        top + height - 10
      );
      ctx.restore();
    },
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
          display: "flex",
          flexDirection: {
            lg: "column",
            md: "row",
            xs: "row",
            sm: "row",
          },
        }}
      >
        {/* <Doughnut
          data={temperatureData}
          options={temperatureOptions}
          updateMode="resize"
          width={700}
          height={400}
          plugins={[temperatureValue]}
        /> */}
        que se vea en uno solo pero con dos arcos uno para temperatura y otro
        para humedad
        <Doughnut
          data={humidityData}
          options={humidityOptions}
          updateMode="resize"
          width={700}
          height={400}
          plugins={[humidityValue]}
        />
      </Paper>
    </Box>
  );
};

export default Gauge;
