import {
  Box,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Stack,
  TextField as TextFieldMUI,
  AutocompleteRenderInputParams,
  Tooltip,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Device,
  DeviceValues,
  MetricAndUnit,
  UnitsConfig,
  accessControl,
  airDVT,
  humidityUnits,
  lightDVT,
  movementDVT,
  temperatureAndHumDVT,
  temperatureUnits,
  vibrationsDVT,
  vibrationsUnits,
  waterFlowDVT,
  waterFlowUnits,
} from "../../api/Device";
import { Space, SpaceRoute } from "../../api/Space";
import { AddRounded, DeleteRounded } from "@mui/icons-material";
import { Field, FieldArray, Form, Formik } from "formik";
import * as yup from "yup";
import { Autocomplete, RadioGroup, TextField } from "formik-mui";
import TextAreaField from "../Fields/TextAreaField";
import RadioGroupField from "../Fields/RadioGroupField";

interface DeviceFormProps {
  deviceID?: string;
}

interface FormValues {
  _id: string;
  name: string;
  description: string;
  currentTopic: string;
  dataVisualizationType: string[];
  values: DeviceValues[];
  createdBy: string;
  createdOn: string;
  topic: string[];
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  currentTopic: "",
  dataVisualizationType: [],
  values: [],
  createdBy: "",
  createdOn: "",
  topic: [""],
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  description: yup.string().required("Por favor, ingrese una descripción"),
  currentTopic: yup.string().required("Por favor, ingrese un tópico/espacio"),
  dataVisualizationType: yup
    .array()
    .required("Por favor, seleccione al menos un tipo de visualización"),
});

const DeviceForm = (props: DeviceFormProps): JSX.Element => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const device = devices.find((device) => device._id === props.deviceID);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        const dataDevices: Device[] = [
          {
            _id: "1",
            name: "Device 1",
            description: "Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",
            dataVisualizationType: ["pie", "bar"],
            currentTopic: "Topic 1",
            history: [
              {
                name: "Device 1",
                description: "Description 1",
                topic: "Topic 1",
                dataVisualizationType: ["pie", "line"],
                values: [
                  {
                    timestamp: "2021-10-01",
                    value: 10,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-02",
                    value: 20,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-03",
                    value: 30,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                ],

                updatedBy: "User 1.23",
                updatedOn: "2021-10-01",
              },
              {
                name: "Device 1.1",
                description: "Description 1.1",
                topic: "Topic 1.1",
                dataVisualizationType: ["pie", "gauge"],
                values: [
                  {
                    timestamp: "2021-10-01",
                    value: 10,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-02",
                    value: 20,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                  {
                    timestamp: "2021-10-03",
                    value: 30,
                    metricsAndUnits: [
                      {
                        metric: "Metric 1",
                        unit: "Unit 1",
                      },
                      {
                        metric: "Metric 2",
                        unit: "Unit 2",
                      },
                    ],
                  },
                ],
                updatedBy: "User 1.5",
                updatedOn: "2021-10-01",
              },
            ],
            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-03",
                value: 40,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
            ],
          },
          {
            _id: "2",
            name: "Device 2",
            description: "Description 2",
            createdOn: "2021-10-01",
            createdBy: "User 2",
            currentTopic: "Topic 2",
            dataVisualizationType: ["bar", "line"],
            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                  {
                    metric: "Metric 3",
                    unit: "Unit 3",
                  },
                  {
                    metric: "Metric 4",
                    unit: "Unit 4",
                  },
                  {
                    metric: "Metric 5",
                    unit: "Unit 5",
                  },
                ],
              },
              {
                timestamp: "2021-10-08",
                value: 30,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                  {
                    metric: "Metric 3",
                    unit: "Unit 3",
                  },
                  {
                    metric: "Metric 4",
                    unit: "Unit 4",
                  },
                  {
                    metric: "Metric 5",
                    unit: "Unit 5",
                  },
                ],
              },
            ],
          },
          {
            _id: "3",
            name: "Device 3",
            description: "Description 3",
            createdOn: "2021-10-01",
            createdBy: "User 3",
            currentTopic: "Topic 3",
            dataVisualizationType: ["pie"],
            values: [
              {
                timestamp: "2021-10-01",
                value: 10,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-02",
                value: 20,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
              {
                timestamp: "2021-10-03",
                value: 30,
                metricsAndUnits: [
                  {
                    metric: "Metric 1",
                    unit: "Unit 1",
                  },
                  {
                    metric: "Metric 2",
                    unit: "Unit 2",
                  },
                ],
              },
            ],
          },
        ];
        const dataSpaces: Space[] = [
          {
            _id: "1",
            name: "Space 1",
            description: "Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",
          },

          {
            _id: "2",
            name: "Space 2",
            description: "Description 1",
            createdOn: "2021-10-01",
            createdBy: "User 1",

            history: [
              {
                name: "cambio 1",
                description: "descipcion 2",
                updatedBy: "userr",
                updatedOn: "565",
                route: "ruta",
              },
            ],
            devices: dataDevices,
          },
        ];
        setDevices(dataDevices);
        setSpaces(dataSpaces);
        setDataLoaded(true);
      }, 2000);
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
    <Box display="flex" justifyContent="left" flexDirection="column">
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
        <Typography>Error: no se pudieron cargar los dispositivos.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            flexDirection: "column",
            ml: {
              lg: 0,
              md: 5,
              sm: 5,
              xs: 5,
            },
          }}
        >
          {props.deviceID ? <> {props.deviceID} </> : <Add spaces={spaces} />}
        </Box>
      )}
    </Box>
  );
};

export default DeviceForm;

function Add(spaces: { spaces: Space[] }) {
  const [topics, setTopics] = useState<SpaceRoute[]>([]);
  const [dtv, setdtv] = useState<UnitsConfig[]>([]);

  // const [metricsAndUnits, setMetricsAndUnits] = useState<MetricAndUnit[]>([]);
  const [metricsAndUnits, setMetricsAndUnits] = useState<UnitsConfig[]>([]);
  const [deviceType, setDeviceType] = useState<String>();

  const tempAndHum = ["Temperatura", "Humedad"];

  useEffect(() => {
    const newTopics = spaces.spaces.map((space) => ({
      _id: space._id!,
      label: space.name,
    }));
    setTopics(newTopics);
    switch (deviceType) {
      case "tempHum":
        setdtv(temperatureAndHumDVT);
        setMetricsAndUnits(temperatureUnits.concat(humidityUnits));
        break;
      case "movimiento":
        setdtv(movementDVT);
        setMetricsAndUnits(vibrationsUnits);
        break;
      case "luz":
        setdtv(lightDVT);
        setMetricsAndUnits([]);
        break;
      case "agua":
        setdtv(waterFlowDVT);
        setMetricsAndUnits(waterFlowUnits);
        break;
      case "humedadTierra":
        setdtv(temperatureAndHumDVT);
        setMetricsAndUnits(temperatureUnits.concat(humidityUnits));
        break;
      case "aire":
        setdtv(airDVT);
        setMetricsAndUnits([]);
        break;
      case "controlAcceso":
        setdtv(accessControl);
        setMetricsAndUnits([]);
        break;
      case "vibraciones":
        setdtv(vibrationsDVT);
        setMetricsAndUnits(vibrationsUnits);
        break;

      default:
        setdtv([]);
        setMetricsAndUnits([]);
        break;
    }
  }, []);

  const handleTopicChange = (selectedTopic: SpaceRoute) => {
    // const newTopics: SpaceRoute[] = [];
    // for (let i = 0; i < spaces.spaces.length; i++) {
    //   if (spaces.spaces[i]._id === selectedTopic._id) {
    //     for (let j = 0; j < spaces.spaces[i].currentRoute.length; j++) {
    //       newTopics.push(spaces.spaces[i].currentRoute[j]);
    //     }
    //   }
    // }
    // setTopics(newTopics);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, touched, errors }) => (
        <Stack component={Form} spacing={2}>
          <Field
            component={TextField}
            name="name"
            type="text"
            label="Nombre"
            variant="outlined"
            fullWidth
          />
          <Field
            component={TextAreaField}
            name="description"
            type="text"
            label="Descripción"
            variant="outlined"
            fullWidth
          />

          <FieldArray name="topic">
            {({ push, remove, form }: any) => (
              <>
                <Typography gutterBottom>
                  Ingrese el tópico/espacio al que pertenece el dispositivo
                </Typography>

                {form.values.topic.map((_: String, index: number) => (
                  <Stack
                    key={index}
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                  >
                    <Field
                      name={`topic.${index}`}
                      component={Autocomplete}
                      options={topics}
                      getOptionLabel={(option: SpaceRoute) =>
                        option.label || ""
                      }
                      renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextFieldMUI
                          {...params}
                          name={`topic.${index}`}
                          label="Tópico/Espacio"
                          required
                          variant="outlined"
                          fullWidth
                          id="textfieldmui"
                          error={
                            touched.currentTopic && Boolean(errors.currentTopic)
                          }
                          helperText={
                            touched.currentTopic && errors.currentTopic
                          }
                        />
                      )}
                      style={{ width: "100%" }}
                    />
                    {form.values.topic.length > 1 && (
                      <Tooltip title="Eliminar" arrow>
                        <IconButton
                          size="large"
                          onClick={() => {
                            /** If removes, then undo the changes of the topics array */

                            remove(index);
                          }}
                        >
                          <DeleteRounded />
                        </IconButton>
                      </Tooltip>
                    )}
                    {form.values.topic.length === 1 && index === 0 && (
                      <Tooltip title="Agregar" arrow>
                        <IconButton
                          size="large"
                          onClick={() => {
                            if (
                              form.values.topic[0] !== "" &&
                              form.values.topic[0] !== undefined &&
                              form.values.topic[0] !== null
                            ) {
                              handleTopicChange(form.values.topic[0]);
                              push(new String());
                            }
                          }}
                        >
                          <AddRounded />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                ))}
              </>
            )}
          </FieldArray>

          <Field
            component={RadioGroup}
            name="deviceType"
            label="Tipo de dispositivo"
          >
            <FormLabel> Indique el tipo de control del dispositivo </FormLabel>
            <FormControlLabel
              value="tempHum"
              control={<Radio />}
              label="Temperatura y Humedad"
              onSelect={() => {
                setDeviceType("temperatureHumidity");
              }}
            />
            <FormControlLabel
              value="movimiento"
              control={<Radio />}
              label="Movimiento"
              onSelect={() => {
                setDeviceType("movimiento");
              }}
            />

            <FormControlLabel
              value="luz"
              control={<Radio />}
              label="Luminarias"
              onSelect={() => {
                setDeviceType("luz");
              }}
            />

            <FormControlLabel
              value="agua"
              control={<Radio />}
              label="Flujo de agua"
              onSelect={() => {
                setDeviceType("agua");
              }}
            />

            <FormControlLabel
              value="humedadTierra"
              control={<Radio />}
              label="Humedad de la tierra"
              onSelect={() => {
                setDeviceType("humedadTierra");
              }}
            />

            <FormControlLabel
              value="aire"
              control={<Radio />}
              label="Aire acondicionado"
              onSelect={() => {
                setDeviceType("aire");
              }}
            />

            <FormControlLabel
              value="controlAcceso"
              control={<Radio />}
              label="Control de acceso"
              onSelect={() => {
                setDeviceType("controlAccess");
              }}
            />

            <FormControlLabel
              value="vibraciones"
              control={<Radio />}
              label="Vibraciones"
              onSelect={() => {
                setDeviceType("vibraciones");
              }}
            />
          </Field>

          {/* <RadioGroupField
            name="deviceType"
            label="Indique el tipo de dispositivo"
            options={[
              { value: "sensor", label: "Sensor" },
              { value: "actuator", label: "Actuador" },
            ]}
          /> */}

          {/*
           * ToDo: Add this fieldArray and keep in mind that we need to change again the data structure for the device */}
          <FieldArray name="metricsAndUnits">
            {({ push, remove, form }: any) => (
              <>
                <Typography gutterBottom>
                  Ingrese las métricas y unidades del dispositivo
                </Typography>
              </>
            )}
          </FieldArray>
        </Stack>
      )}
    </Formik>
  );
}

function Edit(device: { device: Device }) {}

const onSubmit = async (values: Device, { setSubmitting }: any) => {
  await Save(false, values);
  setSubmitting(false);
};

const Save = async (isAdd: boolean, values: Device) => {
  if (isAdd) {
    //  create
  } else {
    // update
  }
};
