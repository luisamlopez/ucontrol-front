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

interface FormValues {
  _id: string;
  name: string;
  description: string;
  dvt: string[];
  createdBy: string;
  createdOn: Date;
  topic: string;
}

const initialValues = {
  _id: "",
  name: "",
  description: "",
  dvt: ["value"],
  createdBy: "",
  createdOn: new Date(),
  topic: "",
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
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [allDevices, setDevices] = useState<Device[]>([]);
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

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const routeRef = useRef<string>(""); // Create a ref to store the route value

  const [dtv, setdtv] = useState<UnitsConfig[]>([]);
  const [deviceType, setDeviceType] = useState<String>();

  useEffect(() => {
    switch (deviceType) {
      case "tempHum":
        setdtv(temperatureAndHumDVT);
        break;
      case "movimiento":
        setdtv(movementDVT);
        break;
      case "luz":
        setdtv(lightDVT);
        break;
      case "agua":
        setdtv(waterFlowDVT);
        break;
      case "humedadTierra":
        setdtv(temperatureAndHumDVT);
        break;
      case "aire":
        setdtv(airDVT);
        break;
      case "controlAcceso":
        setdtv(accessControlDVT);
        break;
      case "vibraciones":
        setdtv(vibrationsDVT);
        break;

      default:
        setdtv([]);
        break;
    }
  }, [deviceType]);

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

  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    console.log(selectedSpace!._id);
    try {
      const deviceData: Device = {
        name: values.name,
        description: values.description,
        dvt: values.dvt,
        createdBy: user?._id!,
        topic: selectedSpace!._id!,
      };
      const response = await createDevice(deviceData, selectedSpace?._id!);
      console.log(response);
      if (response) {
        enqueueSnackbar("Dispositivo creado con éxito", {
          variant: "success",
        });
        navigate("/devices");
      }
      actions.setSubmitting(true);
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const onEdit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    // if (selectedSpace === undefined) {
    //   alert("Seleccione un espacio");
    //   return;
    // } else {
    try {
      const deviceData: Device = {
        _id: values._id,
        name: values.name,
        description: values.description,
        createdBy: values.createdBy,
        dvt: values.dvt,
        topic: values.topic,
      };
      const response = await updateDevice(deviceData, deviceToEdit?._id!);
      if (response) {
        enqueueSnackbar("Dispositivo editado con éxito", {
          variant: "success",
        });
        navigate("/devices");
      }

      actions.setSubmitting(true);
    } catch (error) {
      enqueueSnackbar("Hubo un error", { variant: "error" });
    } finally {
      actions.setSubmitting(false);
    }
    // }
  };

  useEffect(() => {
    if (selectedSpace) {
      const route = findRoute(selectedSpace)
        .map((space) => space.name)
        .join(" / ");
      routeRef.current = route; // Update the ref with the new route value
    }
  }, [findRoute, selectedSpace]);

  useEffect(() => {
    try {
      getSpaces((allSpaces) => {
        setSpaces(allSpaces);
        // console.log(allSpaces);
      });
      // console.log(spaces);
      setDataLoaded(false);
    } catch (error) {
      alert(error);
    }
    if (props.deviceID && deviceToEdit) setDataLoaded(false);
  }, [props.deviceID, deviceToEdit]);

  useEffect(() => {
    try {
      getAllDevicesByUser(user!._id, (devices) => {
        setDevices(devices);
        setDataLoaded(true);
      });
    } catch (error) {
      alert(error);
    }
  }, [allDevices, user]);

  useEffect(() => {
    try {
      getDeviceById(props.deviceID!, (device) => {
        setDeviceToEdit(device);
        setDataLoaded(true);
      });
    } catch (error) {
      alert(error);
    }
  }, [props.deviceID]);

  const initialFormValues: FormValues = props.deviceID
    ? {
        _id: deviceToEdit?._id!,
        name: deviceToEdit?.name!,
        description: deviceToEdit?.description!,
        dvt: deviceToEdit?.dvt!,
        createdBy: deviceToEdit?.createdBy!,
        createdOn: deviceToEdit?.createdOn!,
        topic: deviceToEdit?.topic!,
      }
    : initialValues;

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

                  <Typography gutterBottom>
                    Ingrese el tópico/espacio al que pertenece el dispositivo
                  </Typography>

                  <Field
                    component={Autocomplete}
                    name="topic"
                    options={spaces}
                    getOptionLabel={(option: Space) => option.name || ""}
                    required
                    value={selectedSpace?._id}
                    onChange={(event: any, newValue: Space | null) => {
                      // Use setFieldValue to update the form field value manually
                      // newValue will be null if the user clears the selection
                      setFieldValue("topic", newValue?._id); // Use _id as the value to store in the form field
                      setSelectedSpace(newValue as Space); // Set the selected space state
                    }}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextFieldMUI
                        {...params}
                        label="Espacio/Tópico"
                        variant="outlined"
                        fullWidth
                        autoComplete="on"
                        required
                        error={touched.topic && !!errors.topic}
                        helperText={
                          touched.topic && errors.topic ? errors.topic : ""
                        }
                        sx={{
                          my: 2,
                        }}
                      />
                    )}
                  />
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

                  <Field
                    component={RadioGroup}
                    name="deviceType"
                    label="Tipo de dispositivo"
                    required
                  >
                    <FormLabel>
                      Indique el tipo de control del dispositivo
                    </FormLabel>
                    <FormControlLabel
                      value="tempHum"
                      control={<Radio />}
                      label="Temperatura y Humedad"
                      onChange={() => {
                        setDeviceType("tempHum");
                      }}
                    />
                    <FormControlLabel
                      value="movimiento"
                      control={<Radio />}
                      label="Movimiento"
                      onChange={() => {
                        setDeviceType("movimiento");
                      }}
                    />

                    <FormControlLabel
                      value="luz"
                      control={<Radio />}
                      label="Luminarias"
                      onChange={() => {
                        setDeviceType("luz");
                      }}
                    />

                    <FormControlLabel
                      value="agua"
                      control={<Radio />}
                      label="Flujo de agua"
                      onChange={() => {
                        setDeviceType("agua");
                      }}
                    />

                    <FormControlLabel
                      value="humedadTierra"
                      control={<Radio />}
                      label="Humedad de la tierra"
                      onChange={() => {
                        setDeviceType("humedadTierra");
                      }}
                    />

                    <FormControlLabel
                      value="aire"
                      control={<Radio />}
                      label="Aire acondicionado"
                      onChange={() => {
                        setDeviceType("aire");
                      }}
                    />

                    <FormControlLabel
                      value="controlAcceso"
                      control={<Radio />}
                      label="Control de acceso"
                      onChange={() => {
                        setDeviceType("controlAcceso");
                      }}
                    />

                    <FormControlLabel
                      value="vibraciones"
                      control={<Radio />}
                      label="Vibraciones"
                      onChange={() => {
                        setDeviceType("vibraciones");
                      }}
                    />
                  </Field>
                  {deviceType && (
                    <>
                      <FormLabel>
                        Indique al menos una forma de visualización de datos
                      </FormLabel>
                      <FieldArray name="dvt" required>
                        <div>
                          {dtv.map((dvt, index) => (
                            <div key={index}>
                              <label>
                                <Field
                                  component={Checkbox}
                                  name={`dvt.${index}`}
                                  value={dvt.value}
                                />
                                {dvt.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FieldArray>
                    </>
                  )}

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
                      ¿Desea agregar una condición?
                    </FormLabel>
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Si"
                      onChange={() => {
                        setConditions(true);
                      }}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="No"
                      onChange={() => {
                        setConditions(false);
                      }}
                    />
                  </Field>

                  {conditions && allDevices.length === 0 && (
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
                      <Field
                        component={Autocomplete}
                        name="listenerDevice"
                        options={allDevices}
                        getOptionLabel={(option: Device) => option.name || ""}
                        // onChange={(event: any, newValue: Space) => {
                        //   setSelectedSpace(newValue);
                        //   console.log(findRoute(newValue));
                        // }}
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
                            error={touched.topic && !!errors.topic}
                            helperText={
                              touched.topic && errors.topic ? errors.topic : ""
                            }
                            sx={{
                              my: 2,
                            }}
                          />
                        )}
                      />
                      <Field
                        component={Autocomplete}
                        name="cond"
                        options={allDevices}
                        getOptionLabel={(option: Device) => option.name || ""}
                        // onChange={(event: any, newValue: Space) => {
                        //   setSelectedSpace(newValue);
                        //   console.log(findRoute(newValue));
                        // }}
                        fullWidth
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
                            error={touched.topic && !!errors.topic}
                            helperText={
                              touched.topic && errors.topic ? errors.topic : ""
                            }
                            sx={{
                              my: 2,
                            }}
                          />
                        )}
                      />
                      <Field
                        component={Autocomplete}
                        name="condValue"
                        options={allDevices}
                        getOptionLabel={(option: Device) => option.name || ""}
                        // onChange={(event: any, newValue: Space) => {
                        //   setSelectedSpace(newValue);
                        //   console.log(findRoute(newValue));
                        // }}
                        fullWidth
                        renderInput={(
                          params: AutocompleteRenderInputParams
                        ) => (
                          <TextFieldMUI
                            {...params}
                            label="Valor"
                            variant="outlined"
                            fullWidth
                            autoComplete="on"
                            required
                            error={touched.topic && !!errors.topic}
                            helperText={
                              touched.topic && errors.topic ? errors.topic : ""
                            }
                            sx={{
                              my: 2,
                            }}
                          />
                        )}
                      />
                    </Box>
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
