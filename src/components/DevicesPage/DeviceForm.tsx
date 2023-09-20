import {
  Box,
  Checkbox,
  Typography,
  CircularProgress,
  Button,
  Stack,
  TextField as TextFieldMUI,
  AutocompleteRenderInputParams,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  Device,
  UnitsConfig,
  accessControlDVT,
  airDVT,
  createDevice,
  getAllDevicesByUser,
  getDeviceById,
  getSpaceFromDeviceId,
  lightDVT,
  movementDVT,
  temperatureAndHumDVT,
  updateDevice,
  vibrationsDVT,
  waterFlowDVT,
} from "../../api/Device";
import { Space, getSpaces } from "../../api/Space";
import { Field, FieldArray, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { Autocomplete, RadioGroup, TextField } from "formik-mui";
import TextAreaField from "../Fields/TextAreaField";
import { useUser } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

interface DeviceFormProps {
  deviceID?: string;
}

interface Options {
  label: string;
  value: string;
}

interface FormValues {
  _id: string;
  name: string;
  description: string;
  dvt: string[];
  createdBy: string;
  createdOn: Date;
  type: string;
  cons?: {
    listenerDevice?: string;
    secondTopic?: string;
    cond?: Options;
    condValue?: Options;
    condValueTemp?: Options;
    // instruction?: Options;
  };
  instruction?: Options;
  listenerDevice?: string;
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  dvt: ["value"],
  createdBy: "",
  createdOn: new Date(),
  type: "",
  cons: {
    listenerDevice: "",
    secondTopic: "",
    cond: {
      label: "",
      value: "",
    },

    condValue: {
      label: "",
      value: "",
    },
    condValueTemp: {
      label: "",
      value: "",
    },
    instruction: {
      label: "",
      value: "",
    },
  },
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Por favor, ingrese un nombre"),
  // topic: yup.string().required("Por favor, ingrese un tópico/espacio"),
  dvt: yup
    .array()
    .required("Por favor, seleccione al menos un tipo de visualización"),
});

const DeviceForm = (props: DeviceFormProps): JSX.Element => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(true);
  const [deviceToEdit, setDeviceToEdit] = useState<Device | undefined>(
    undefined
  );
  const [conditions, setConditions] = useState<boolean>(false);
  const { user } = useUser();
  const [selectedSpace, setSelectedSpace] = useState<Space | undefined>({
    _id: "",
    name: "",
    description: "",
    subSpaces: [],
    createdBy: "",
    createdOn: new Date(),
  });
  const [initialFormValues, setInitialFormValues] =
    useState<FormValues>(initialValues);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const routeRef = useRef<string>(""); // Create a ref to store the route value

  const [dvt, setDvt] = useState<UnitsConfig[]>([]);
  const [deviceType, setDeviceType] = useState<String>();
  const [conditionsOptions, setConditionsOptions] = useState<Options[]>([]);
  const [condValueOptions, setCondValueOptions] = useState<Options[]>([]);
  const [condValueHum, setCondValueHum] = useState<Options[]>([]);
  const [isNumeric, setIsNumeric] = useState<boolean>(false);
  const [isTempHum, setIsTempHum] = useState<boolean>(false);
  const [listenerDevice, setListenerDevice] = useState<Device | undefined>();
  const [instructionsOptions, setInstruction] = useState<Options[]>([
    { label: "Encendido", value: "1" },
    { label: "Apagado", value: "0" },
  ]);

  useEffect(() => {
    switch (deviceType) {
      case "tempHum":
        setDvt(temperatureAndHumDVT);
        break;
      case "movimiento":
        setDvt(movementDVT);
        break;
      case "luz":
        setDvt(lightDVT);
        break;
      case "agua":
        setDvt(waterFlowDVT);
        break;
      case "hum":
        setDvt(temperatureAndHumDVT);
        break;
      case "aire":
        setDvt(airDVT);
        break;
      case "controlAcceso":
        setDvt(accessControlDVT);
        break;
      case "vibraciones":
        setDvt(vibrationsDVT);
        break;
      default:
        setDvt([]); // Clear the dvt array for unrecognized device types
    }
  }, [deviceType]);

  useEffect(() => {
    console.log(allDevices);
  }, [allDevices]);
  /**
   * @description Get the information of a space given its id
   * @param id
   * @returns Space
   */
  const getSpaceInfo = (_id: string) => {
    let space: Space | undefined;
    for (let i = 0; i < spaces.length; i++) {
      if (spaces[i]._id === _id) {
        space = spaces[i];

        break;
      }
    }
    return space;
  };

  /**
   * @description Recursive function to find the "route" of the space, i.e. the parent spaces that it belongs to, if any (e.g. a room belongs to a floor, which belongs to a building, etc.)
   * @param space The space to find the route of
   */
  const findRoute = (space: Space): Space[] => {
    let route: Space[] = [];
    let currentSpace: Space | undefined = space;

    while (currentSpace) {
      route.unshift(currentSpace); // Add current space to the beginning of the route array
      const parentSpaceId = currentSpace.parentSpace;

      if (parentSpaceId) {
        // Find the parent space based on its ID
        const parentSpace = getSpaceInfo(parentSpaceId);

        if (parentSpace) {
          currentSpace = parentSpace;
        } else {
          // If parent space is not found, stop the loop
          currentSpace = undefined;
          console.error(`Parent space with ID ${parentSpaceId} not found.`);
        }
      } else {
        // If there is no parent space, stop the loop
        currentSpace = undefined;
      }
    }

    return route;
  };

  /**
   * @description Function to handle the form submission
   * @param values
   * @param actions
   */
  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      if (conditions) {
        const cons = {
          listenerDevice: values.listenerDevice
            ? listenerDevice?.type === "tempHum"
              ? listenerDevice?.topic + " / Temperatura"
              : values.listenerDevice
            : "",
          secondTopic:
            values.listenerDevice && listenerDevice?.type === "tempHum"
              ? listenerDevice?.topic + " / Humedad"
              : values.listenerDevice,
          condition: values.cons!.cond?.value!,
          conditionValue:
            values.cons!.cond?.value!.includes("1") ||
            values.cons!.cond?.value!.includes("0")
              ? ""
              : isTempHum
              ? values.cons!.condValueTemp?.value!
              : values.cons!.condValue?.value!,
          secondConditionValue: isTempHum ? values.cons!.condValue?.value! : "",
          instruction: values.instruction?.value!,
        };

        const deviceData: Device = {
          name: values.name,
          description: values.description,
          dvt: values.dvt,
          createdBy: user?._id!,
          type: values.type,
          topic: routeRef.current + " / " + values.name,
          conditions: cons,
        };

        console.log(deviceData);
        const response = await createDevice(
          deviceData,
          selectedSpace?._id!,
          user?.name!
        );
        console.log(response);
        if (response) {
          enqueueSnackbar("Dispositivo creado con éxito", {
            variant: "success",
          });
          navigate("/devices");
        } else {
          enqueueSnackbar("Hubo un error", { variant: "error" });
        }
      } else {
        const deviceData: Device = {
          name: values.name,
          description: values.description,
          dvt: values.dvt,
          createdBy: user?._id!,
          type: values.type,
          topic: routeRef.current + " / " + values.name,
        };

        console.log(deviceData);
        const response = await createDevice(
          deviceData,
          selectedSpace?._id!,
          user?.name!
        );
        console.log(response);
        if (response) {
          enqueueSnackbar("Dispositivo creado con éxito", {
            variant: "success",
          });
          navigate("/devices");
        } else {
          enqueueSnackbar("Hubo un error", { variant: "error" });
        }
      }

      actions.setSubmitting(true);
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  /**
   * @description Function to handle the form submission when editing a device
   * @param values
   * @param actions
   */
  const onEdit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      if (!values.dvt || values.dvt.length! === 0) {
        enqueueSnackbar("Debe seleccionar al menos un tipo de visualización", {
          variant: "error",
        });
        return;
      } else {
        if (conditions) {
          const cons = {
            listenerDevice: values.listenerDevice
              ? listenerDevice?.type === "tempHum"
                ? listenerDevice?.topic + " / Temperatura"
                : values.listenerDevice
              : "",
            secondTopic:
              values.listenerDevice && listenerDevice?.type === "tempHum"
                ? listenerDevice?.topic + " / Humedad"
                : values.listenerDevice,
            condition: values.cons!.cond?.value!,
            conditionValue:
              values.cons!.cond?.value!.includes("1") ||
              values.cons!.cond?.value!.includes("0")
                ? ""
                : isTempHum
                ? values.cons!.condValueTemp?.value!
                : values.cons!.condValue?.value!,
            secondConditionValue: isTempHum
              ? values.cons!.condValue?.value!
              : "",
            instruction: values.instruction?.value!,
          };

          const deviceData: Device = {
            _id: props.deviceID!,
            name: values.name,
            description: values.description,
            createdBy: values.createdBy,
            dvt: values.dvt,
            type: values.type,
            topic: routeRef.current + " / " + values.name,
            conditions: cons,
          };
          const fields: string[] = [];
          //fill the fields to add on the history
          if (values.name !== deviceToEdit?.name) {
            fields.push(
              "Cambio de nombre: " + deviceToEdit?.name + " -> " + values.name
            );
          }
          if (values.description !== deviceToEdit?.description) {
            fields.push(
              "Cambio de descripción: " +
                deviceToEdit?.description +
                " -> " +
                values.description
            );
          }
          if (
            JSON.stringify(values.dvt) !== JSON.stringify(deviceToEdit?.dvt)
          ) {
            fields.push(
              "Cambio de tipo de visualización: " +
                deviceToEdit?.dvt +
                " -> " +
                deviceData.dvt
            );
          }
          if (deviceData.topic !== deviceToEdit?.topic) {
            fields.push(
              "Cambio de tópico: " +
                deviceToEdit?.topic +
                " -> " +
                routeRef.current +
                " / " +
                values.name
            );
          }
          if (deviceToEdit?.conditions) {
            if (
              deviceData.conditions?.listenerDevice !==
                deviceToEdit?.conditions?.listenerDevice ||
              deviceData.conditions?.condition !==
                deviceToEdit?.conditions?.condition ||
              deviceData.conditions?.conditionValue !==
                deviceToEdit?.conditions?.conditionValue ||
              deviceData.conditions?.secondConditionValue !==
                deviceToEdit?.conditions?.secondConditionValue ||
              deviceData.conditions?.instruction !==
                deviceToEdit?.conditions?.instruction
            ) {
              fields.push("Cambio de condición/regla");
            }
          }

          const response = await updateDevice(
            deviceData,
            props.deviceID!,
            fields,
            user?.name!
          );
          if (response) {
            enqueueSnackbar("Dispositivo editado con éxito", {
              variant: "success",
            });
            navigate("/devices");
          } else {
            enqueueSnackbar("Hubo un error", {
              variant: "error",
            });
          }
        } else {
          const deviceData: Device = {
            _id: props.deviceID!,
            name: values.name,
            description: values.description,
            createdBy: values.createdBy,
            dvt: values.dvt,
            type: values.type,
            topic: routeRef.current + " / " + values.name,
          };
          const fields: string[] = [];
          //fill the fields to add on the history
          if (values.name !== deviceToEdit?.name) {
            fields.push(
              "Cambio de nombre: " + deviceToEdit?.name + " -> " + values.name
            );
          }
          if (values.description !== deviceToEdit?.description) {
            fields.push(
              "Cambio de descripción: " +
                deviceToEdit?.description +
                " -> " +
                values.description
            );
          }
          if (
            JSON.stringify(values.dvt) !== JSON.stringify(deviceToEdit?.dvt)
          ) {
            fields.push(
              "Cambio de tipo de visualización: " +
                deviceToEdit?.dvt +
                " -> " +
                deviceData.dvt
            );
          }
          if (deviceData.topic !== deviceToEdit?.topic) {
            fields.push(
              "Cambio de tópico: " +
                deviceToEdit?.topic +
                " -> " +
                routeRef.current +
                " / " +
                values.name
            );
          }

          const response = await updateDevice(
            deviceData,
            props.deviceID!,
            fields,
            user?.name!
          );
          console.log(response);
          if (response) {
            enqueueSnackbar("Dispositivo editado con éxito", {
              variant: "success",
            });
            navigate("/devices");
          } else {
            enqueueSnackbar("Hubo un error", {
              variant: "error",
            });
          }
        }

        actions.setSubmitting(true);
      }
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
    // }
  };

  /**
   * Get the device to edit
   */
  useEffect(() => {
    const fetch = async () => {
      if (props.deviceID) {
        try {
          await getDeviceById(props.deviceID!, async (device) => {
            setDeviceToEdit(device);
            setDataLoaded(false);
            if (device.conditions) {
              try {
                await getDeviceById(
                  device.conditions.listenerDevice!,
                  (listenerDevice) => {
                    setListenerDevice(listenerDevice);
                  }
                );
              } catch (error: any) {
                console.log("error");
              }
            }
            console.log(device);
          });
        } catch (error) {
          alert(error);
        }
      }
    };

    fetch();
  }, [props.deviceID]);

  /**
   * Set the initial form values when the device to edit is loaded
   */
  useEffect(() => {
    const fetch = async () => {
      if (deviceToEdit) {
        const initialFormValues: FormValues = {
          _id: deviceToEdit._id!,
          name: deviceToEdit.name,
          description: deviceToEdit.description || "",
          dvt: deviceToEdit.dvt || [],
          createdBy: deviceToEdit.createdBy || "",
          createdOn: deviceToEdit.createdOn || new Date(),
          type: deviceToEdit.type || "",
          cons: deviceToEdit.conditions || {},
        };
        setDeviceType(deviceToEdit.type!);

        setInitialFormValues(initialFormValues);
      }
    };

    fetch();
  }, [deviceToEdit]);

  /**
   * Get the route of the selected space
   */
  useEffect(() => {
    if (selectedSpace) {
      const route = findRoute(selectedSpace)
        .map((space) => space.name)
        .join(" / ");
      routeRef.current = route; // Update the ref with the new route value
    }
  }, [findRoute, selectedSpace]);

  /**
   * Get the space from the device ID and set it as the selected space when editing a device
   */
  useEffect(() => {
    const fetch = async () => {
      if (props.deviceID) {
        getSpaceFromDeviceId(props.deviceID, (space) => {
          setSelectedSpace(getSpaceInfo(space));
        });
      }
    };
    fetch();
  }, [getSpaceInfo, props.deviceID]);

  /**
   * Get all the spaces to show them in the autocomplete for the space where the device will be added
   */
  useEffect(() => {
    const fetch = async () => {
      try {
        await getSpaces(user?._id!, (allSpaces) => {
          setSpaces(allSpaces);
        });
        setDataLoaded(false);
      } catch (error) {}
    };
    fetch();
  }, [props.deviceID, deviceToEdit, user?._id]);

  /**
   * Get all the devices to show them in the autocomplete for the device to listen to
   */

  useEffect(() => {
    const fetch = async () => {
      try {
        await getAllDevicesByUser(user!._id, (devices) => {
          console.log(devices);
          setAllDevices(
            devices.filter(
              (obj) =>
                obj.type !== "luz" &&
                obj.type !== "aire" &&
                obj.type !== "controlAcceso"
            )
          );
        });
      } catch (error) {}
    };
    fetch();
  }, [user]);

  /**
   * Get the conditions options to show them in the autocomplete for the conditions
   */
  function onChangeSetConditionsOptions(type: string) {
    if (type === "tempHum" || type === "hum") {
      setIsNumeric(true);
      setIsTempHum(type === "tempHum" ? true : false);
      setConditionsOptions([
        { label: ">", value: ">" },
        { label: "<", value: "<" },
        { label: "=", value: "=" },
        { label: ">=", value: ">=" },
        { label: "<=", value: "<=" },
      ]);
      setCondValueHum([
        { label: "20", value: "20" },
        { label: "30", value: "30" },
        { label: "40", value: "40" },
        { label: "50", value: "50" },
      ]);
      setCondValueOptions([
        { label: "20", value: "20" },
        { label: "30", value: "30" },
        { label: "40", value: "40" },
        { label: "50", value: "50" },
        { label: "60", value: "60" },
        { label: "70", value: "70" },
        { label: "80", value: "80" },
        { label: "90", value: "90" },
        { label: "100", value: "100" },
      ]);
    } else {
      setIsNumeric(false);
      setIsTempHum(false);
      setConditionsOptions([
        { label: "Detecta presencia", value: "1" },
        { label: "No detecta presencia", value: "0" },
      ]);
    }
  }

  return (
    <Box display="flex" justifyContent="left" flexDirection="column">
      {dataLoaded ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : spaces.length === 0 ? (
        <Typography>
          No hay espacios registrados, agrega uno antes de crear un dispositivo.
        </Typography>
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
          {props.deviceID && !deviceToEdit ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Formik
              initialValues={initialFormValues}
              validationSchema={validationSchema}
              onSubmit={props.deviceID ? onEdit : onSubmit}
            >
              {({ isSubmitting, touched, errors, values, setFieldValue }) => (
                <Stack component={Form} spacing={2}>
                  <Field
                    component={TextField}
                    name="name"
                    type="text"
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    value={values.name}
                  />
                  <Field
                    component={TextAreaField}
                    name="description"
                    type="text"
                    label="Descripción"
                    variant="outlined"
                    fullWidth
                    value={values.description}
                  />
                  {!props.deviceID && (
                    <>
                      <Typography gutterBottom>
                        Ingrese el tópico/espacio al que pertenece el
                        dispositivo
                      </Typography>

                      <Field
                        component={Autocomplete}
                        name="topic"
                        options={spaces}
                        getOptionLabel={(option: Space) => option.name || ""}
                        required
                        // value={selectedSpace?._id}
                        onChange={(event: any, newValue: Space | null) => {
                          // Use setFieldValue to update the form field value manually
                          // newValue will be null if the user clears the selection
                          setFieldValue("topic", newValue?._id); // Use _id as the value to store in the form field
                          setSelectedSpace(newValue as Space); // Set the selected space state
                        }}
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
                          <TextFieldMUI
                            {...params}
                            label="Espacio/Tópico"
                            variant="outlined"
                            fullWidth
                            autoComplete="on"
                            required
                            // error={touched.topic && !!errors.topic}
                            // helperText={
                            //   touched.topic && errors.topic ? errors.topic : ""
                            // }
                            sx={{
                              my: 2,
                            }}
                          />
                        )}
                      />
                    </>
                  )}

                  {routeRef && (
                    <>
                      <Typography
                        sx={{
                          fontStyle: "italic",
                          fontSize: "14px",
                        }}
                      >
                        Ruta del espacio seleccionado:
                      </Typography>
                      <Typography
                        sx={{
                          fontStyle: "italic",
                          fontSize: "14px",
                          my: 2,
                        }}
                      >
                        {routeRef.current}
                      </Typography>
                    </>
                  )}
                  {!props.deviceID && (
                    <Field
                      component={RadioGroup}
                      name="type"
                      label="Tipo de dispositivo"
                      required
                    >
                      <FormLabel>
                        Indique el tipo de control del dispositivo
                      </FormLabel>
                      <FormControlLabel
                        value="tempHum"
                        control={<Radio />}
                        label="Sensor de temperatura y humedad del aire"
                        onChange={() => {
                          setDeviceType("tempHum");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />
                      <FormControlLabel
                        value="movimiento"
                        control={<Radio />}
                        label="Sensor de movimiento"
                        onChange={() => {
                          setDeviceType("movimiento");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />

                      <FormControlLabel
                        value="luz"
                        control={<Radio />}
                        label="Control de luminaria"
                        onChange={() => {
                          setDeviceType("luz");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />

                      <FormControlLabel
                        value="agua"
                        control={<Radio />}
                        label="Sensor de presencia de agua"
                        onChange={() => {
                          setDeviceType("agua");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />

                      <FormControlLabel
                        value="hum"
                        control={<Radio />}
                        label="Sensor de humedad de la tierra"
                        onChange={() => {
                          setDeviceType("hum");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />

                      <FormControlLabel
                        value="aire"
                        control={<Radio />}
                        label="Control de aire acondicionado"
                        onChange={() => {
                          setDeviceType("aire");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />

                      <FormControlLabel
                        value="controlAcceso"
                        control={<Radio />}
                        label="Control de acceso"
                        onChange={() => {
                          setDeviceType("controlAcceso");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />

                      <FormControlLabel
                        value="vibraciones"
                        control={<Radio />}
                        label="Sensor de vibraciones"
                        onChange={() => {
                          setDeviceType("vibraciones");
                          values.dvt = [];
                          setConditions(false);
                        }}
                      />
                    </Field>
                  )}
                  {deviceType && (
                    <>
                      <FormLabel>
                        Indique al menos una forma de visualización de datos
                      </FormLabel>
                      <FieldArray name="dvt">
                        <div>
                          {dvt.map((dvt, index) => {
                            const isChecked = values.dvt.includes(dvt.value);

                            return (
                              <div key={index}>
                                <label>
                                  <Field
                                    component={Checkbox}
                                    name={`dvt.${index}`}
                                    value={dvt.value}
                                    checked={isChecked}
                                    onChange={(
                                      event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      const value = event.target.value;
                                      const newValue = values.dvt.includes(
                                        value
                                      )
                                        ? values.dvt.filter(
                                            (dvt) => dvt !== value
                                          )
                                        : [...values.dvt, value];
                                      setFieldValue("dvt", newValue);
                                    }}
                                  />
                                  {dvt.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </FieldArray>
                    </>
                  )}
                  {props.deviceID && deviceToEdit?.conditions && (
                    <Box
                      sx={{
                        border: "1px solid #3f51b5",
                        borderRadius: "5px",
                        p: 2,
                      }}
                    >
                      <Typography>
                        Este dispositivo tiene una condición asociada al tópico
                        "{deviceToEdit.conditions.listenerDevice}" y{" "}
                        {deviceToEdit.conditions.instruction === "1"
                          ? "se enciende"
                          : "se apaga"}{" "}
                        cuando detecta{" "}
                        {deviceToEdit?.conditions?.condition === "1" ||
                        deviceToEdit?.conditions?.condition === "0"
                          ? "o no presencia"
                          : deviceToEdit?.conditions?.condition}{" "}
                        {deviceToEdit?.conditions?.conditionValue
                          ? deviceToEdit?.conditions?.conditionValue
                          : ""}
                        {deviceToEdit.conditions.listenerDevice?.includes(
                          "Temperatura"
                        )
                          ? "°C"
                          : deviceToEdit.conditions.listenerDevice?.includes(
                              "Humedad"
                            )
                          ? "%"
                          : ""}
                        {/* {listenerDevice?.name}  */}.
                      </Typography>
                    </Box>
                  )}
                  {(deviceType === "luz" || deviceType === "aire") && (
                    <Field
                      component={RadioGroup}
                      name="conditions"
                      label="¿Desea agregar una condición?"
                      required
                    >
                      <FormLabel
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          fontSize: "18px",
                        }}
                      >
                        ¿
                        {props.deviceID && deviceToEdit?.conditions
                          ? "Desea cambiar la condición"
                          : "Desea agregar una condición"}
                        ?
                      </FormLabel>
                      <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Si"
                        onChange={() => {
                          setConditions(true);
                          setConditionsOptions([]);
                          setCondValueOptions([]);
                        }}
                      />
                      <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="No"
                        onChange={() => {
                          setConditions(false);
                          setConditionsOptions([]);
                          setCondValueOptions([]);
                        }}
                      />
                    </Field>
                  )}

                  {((conditions && allDevices.length > 0) ||
                    (conditions &&
                      allDevices.length > 0 &&
                      props.deviceID &&
                      deviceToEdit?.conditions)) && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: {
                            lg: "row",
                            md: "row",
                            sm: "column",
                            xs: "column",
                          },
                          alignItems: {
                            lg: "center",
                            md: "center",
                            sm: "flex-start",
                            xs: "flex-start",
                          },
                          justifyContent: "space-between",
                          gap: {
                            lg: 2,
                            md: 2,
                            sm: 0,
                            xs: 0,
                          },
                        }}
                      >
                        {/* <Typography gutterBottom>
                          Cambiar el estado de {values.name} cuando:
                        </Typography> */}

                        <Field
                          component={Autocomplete}
                          name="instruction"
                          // Filter the devices to only show the ones that are not type luz or aire
                          options={instructionsOptions}
                          getOptionLabel={(option: Options) =>
                            option.label || ""
                          }
                          onChange={(event: any, newValue: Options | null) => {
                            setFieldValue("instruction", newValue);
                          }}
                          fullWidth
                          renderInput={(
                            params: AutocompleteRenderInputParams
                          ) => (
                            <TextFieldMUI
                              {...params}
                              label="Acción a realizar"
                              variant="outlined"
                              fullWidth
                              autoComplete="on"
                              required
                              sx={{
                                my: 2,
                              }}
                            />
                          )}
                        />
                        <Field
                          component={Autocomplete}
                          name="listenerDevice"
                          // Filter the devices to only show the ones that are not type luz or aire
                          options={allDevices}
                          getOptionLabel={(option: Device) => option.name || ""}
                          onChange={(event: any, newValue: Device | null) => {
                            onChangeSetConditionsOptions(newValue?.type!);
                            setFieldValue("listenerDevice", newValue?.topic);
                            setListenerDevice(newValue as Device);
                          }}
                          fullWidth
                          renderInput={(
                            params: AutocompleteRenderInputParams
                          ) => (
                            <TextFieldMUI
                              {...params}
                              label="Dispositivo a escuchar"
                              variant="outlined"
                              fullWidth
                              autoComplete="on"
                              required
                              sx={{
                                my: 2,
                              }}
                            />
                          )}
                        />
                        <Field
                          component={Autocomplete}
                          name="cons.cond"
                          options={conditionsOptions}
                          getOptionLabel={(option: Options) =>
                            option.label || ""
                          }
                          fullWidth
                          onChange={(event: any, newValue: Options) => {
                            setFieldValue("cons.cond", newValue);
                          }}
                          renderInput={(
                            params: AutocompleteRenderInputParams
                          ) => (
                            <TextFieldMUI
                              {...params}
                              label="Condición"
                              variant="outlined"
                              fullWidth
                              autoComplete="on"
                              required
                              sx={{
                                my: 2,
                              }}
                            />
                          )}
                        />
                        {isNumeric && (
                          <Field
                            component={Autocomplete}
                            name="cons.condValue"
                            options={condValueOptions}
                            getOptionLabel={(option: any) => option.label || ""}
                            fullWidth
                            onChange={(event: any, newValue: Options) => {
                              setFieldValue("cons.condValue", newValue);
                            }}
                            renderInput={(
                              params: AutocompleteRenderInputParams
                            ) => (
                              <TextFieldMUI
                                {...params}
                                label={isTempHum ? "Valor de humedad" : "Valor"}
                                variant="outlined"
                                fullWidth
                                autoComplete="on"
                                required
                                sx={{
                                  my: 2,
                                }}
                              />
                            )}
                          />
                        )}
                        {isNumeric && isTempHum && (
                          <Field
                            component={Autocomplete}
                            name="cons.condValueTemp"
                            options={condValueHum}
                            getOptionLabel={(option: any) => option.label || ""}
                            fullWidth
                            onChange={(event: any, newValue: Options) => {
                              setFieldValue("cons.condValueTemp", newValue);
                            }}
                            renderInput={(
                              params: AutocompleteRenderInputParams
                            ) => (
                              <TextFieldMUI
                                {...params}
                                label={"Valor de temperatura"}
                                variant="outlined"
                                fullWidth
                                autoComplete="on"
                                required
                                sx={{
                                  my: 2,
                                }}
                              />
                            )}
                          />
                        )}
                      </Box>
                      {/* Add another set of conditions */}
                    </>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      placeSelf: "flex-end",
                      width: "50%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2,
                        mr: 2,
                      }}
                      onClick={() => {
                        navigate("/devices");
                      }}
                    >
                      Cancelar
                    </Button>
                    <LoadingButton
                      sx={{
                        mt: 2,
                      }}
                      type="submit"
                      loading={isSubmitting}
                      loadingIndicator="Procesando..."
                      variant="contained"
                      color="primary"
                    >
                      Guardar
                    </LoadingButton>
                  </Box>
                </Stack>
              )}
            </Formik>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DeviceForm;
