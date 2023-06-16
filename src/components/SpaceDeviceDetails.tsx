import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Container,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Device } from "../api/Device";
import { Space } from "../api/Space";
import { useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { KeyboardArrowDownRounded } from "@mui/icons-material";
import DevicesDetailsText from "./DeviceDetailsText";

const options = ["Descargar CSV", "Descargar PDF"];

function Details(props: { device: Device }): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: {
          lg: "30%",
          md: "30%",
          xs: "100%",
          sm: "100%",
        },
        backgroundColor: "white",
        p: 1,
        mt: 1,
        borderRadius: "4px",
      }}
    >
      <Typography fontWeight={"bold"} textAlign={"left"} color={"primary.main"}>
        Detalles del dispositivo
      </Typography>

      <DevicesDetailsText
        title={"Descripcion: "}
        value={props.device.description}
      />

      <DevicesDetailsText
        title={"Conectado desde el: "}
        value={props.device.createdOn}
      />

      <DevicesDetailsText title="Tópico: " value={props.device.currentTopic} />

      <DevicesDetailsText
        title={"Instrucciones: "}
        value={
          "props.device.instructions Pasadas las 6 pm enviar notificaciones si se detectan movimientos."
        }
      />
    </Box>
  );
}

function Graph(props: { device: Device }): JSX.Element {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    alert("Descargando " + options[index]);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
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
        flexDirection: "column",
        width: {
          lg: "70%",
          md: "70%",
          xs: "100%",
          sm: "100%",
        },
        backgroundColor: "white",
        p: 1,
        mt: 1,
        ml: 1,
        borderRadius: "4px",
      }}
    >
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        sx={{
          alignSelf: "flex-end",
        }}
      >
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
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
    </Box>
  );
}

function DeviceDetails(props: { device: Device }): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        backgroundColor: "#ECEEEF",
        borderRadius: "8px",
        p: 1,
        mb: 1,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          fontWeight={"bold"}
          textAlign={"left"}
          fontSize={{ xs: 14, sm: 18, lg: 18 }}
        >
          {props.device.name}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Details device={props.device} />
        <Graph device={props.device} />
      </Box>
    </Box>
  );
}

const SpaceDeviceDetails = (): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const { spaceID } = useParams<{ spaceID: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevices: Device[] = [
          {
            id: "1",
            name: "Device 1",
            description: "Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",
            history: [
              {
                name: "Device 1",
                description: "Description 1",
                topic: "Topic 1",
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                    value: "10",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                    value: "10",
                  },
                ],
                updatedBy: "User 1.23",
                updatedOn: "2021-10-01",
              },
              {
                name: "Device 1.1",
                description: "Description 1.1",
                topic: "Topic 1.1",
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                    value: "20",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                    value: "20",
                  },
                ],
                updatedBy: "User 1.5",
                updatedOn: "2021-10-01",
              },
            ],
            currentTopic: "Topic 1",
            metricsAndUnits: [
              {
                metric: "Metric 1",
                unit: "Unit 1",
                value: "10",
              },
              {
                metric: "Metric 2",
                unit: "Unit 2",
                value: "10",
              },
            ],
          },
          {
            id: "2",
            name: "Device 2",
            description: "Description 2",
            createdOn: "2021-10-01",
            createdBy: "User 2",
            currentTopic: "Topic 2",
            metricsAndUnits: [
              {
                metric: "Metric 1",
                unit: "Unit 1",
                value: "10",
              },
              {
                metric: "Metric 2",
                unit: "Unit 2",
                value: "10",
              },
            ],
          },
          {
            id: "3",
            name: "Device 3",
            description: "Description 3",
            createdOn: "2021-10-01",
            createdBy: "User 3",
            currentTopic: "Topic 3",
            metricsAndUnits: [
              {
                metric: "Metric 1",
                unit: "Unit 1",
                value: "10",
              },
              {
                metric: "Metric 2",
                unit: "Unit 2",
                value: "10",
              },
            ],
          },
        ];

        setDevices(dataDevices);

        setDataLoaded(true);
      }, 5000);
    };

    try {
      fetchData();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="left">
      <Sidebar />
      <Container sx={{ m: 0, p: 0, width: "100%" }}>
        <Box
          display={"flex"}
          flexDirection="column"
          sx={{
            p: 2,
          }}
        >
          <Typography
            color="primary"
            textAlign="left"
            fontSize={{ xs: 24, sm: 48, lg: 48 }}
            fontWeight={600}
            p={0}
            mt={{ xs: 6, sm: 0, lg: 0 }}
            mb={2}
          >
            Dispositivos del espacio {spaceID} (buscar en BD)
          </Typography>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : !dataLoaded ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : devices.length === 0 ? (
            <Typography
              color="primary"
              textAlign="left"
              fontSize={{ xs: 16, sm: 24, lg: 24 }}
              fontWeight={600}
              p={0}
              mt={{ xs: 6, sm: 0, lg: 0 }}
              mb={2}
            >
              Error: no se pudieron cargar los dispositivos.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mb: 5,
              }}
            >
              {devices.map((device, index) => (
                <DeviceDetails device={device} key={index} />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SpaceDeviceDetails;
