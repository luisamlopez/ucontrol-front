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
import { Space } from "../../api/Space";
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
  dvt: ("line" | "bar" | "pie" | "gauge" | "scatter" | "table" | "value")[];
  createdBy: string;
  createdOn: Date;
  topic: string[];
  values: DeviceValues[];
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  dvt: ["value"],
  createdBy: "",
  createdOn: new Date(),
  topic: [""],
  values: [],
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  description: yup.string().required("Por favor, ingrese una descripción"),
  topic: yup.string().required("Por favor, ingrese un tópico/espacio"),
  dvt: yup
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
            createdOn: new Date("2022-01-01T00:00:00Z"),
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
                updatedOn: new Date("2022-01-01T00:00:00Z"),
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
                updatedOn: new Date("2022-01-01T00:00:00Z"),
              },
            ],
            values: [
              {
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
            history: [
              {
                updatedBy: "User 1",
                updatedOn: new Date(2022, 10, 1, 14, 23, 8),
                field: ["Cambio 1"],
              },
            ],
          },
          {
            _id: "2",
            name: "Device 2",
            description: "Description 2",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 2",
            dvt: ["bar", "line"],
            topic: ["Topic 2.2", "Topic 2.2", "Topic 2.3"],
            values: [
              {
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 3",
            dvt: ["pie"],

            topic: ["Topic 3.1", "Topic 3.2", "Topic 3.3"],
            values: [
              {
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
                timestamp: new Date(2022, 10, 1, 14, 23, 8),
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
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 1",
          },

          {
            _id: "2",
            name: "Space 2",
            description: "Description 1",
            createdOn: new Date("2022-01-01T00:00:00Z"),
            createdBy: "User 1",

            history: [
              {
                field: ["cambio 1"],
                updatedBy: "userr",
                updatedOn: new Date("2022-01-01T00:00:00Z"),
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
  const [topics, setTopics] = useState<any[]>([]);
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
                      // getOptionLabel={(option: SpaceRoute) =>
                      //   option.label || ""
                      // }
                      renderInput={(params: AutocompleteRenderInputParams) => (
                        <TextFieldMUI
                          {...params}
                          name={`topic.${index}`}
                          label="Tópico/Espacio"
                          required
                          variant="outlined"
                          fullWidth
                          id="textfieldmui"
                          error={touched.topic && Boolean(errors.topic)}
                          helperText={touched.topic && errors.topic}
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
