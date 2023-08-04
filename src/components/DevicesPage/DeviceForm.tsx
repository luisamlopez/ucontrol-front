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
  getAllDevicesByUser,
  lightDVT,
  movementDVT,
  temperatureAndHumDVT,
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
  const onSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    //  try {
    //    if (!spaceType) {
    //      const spaceData: Space = {
    //        name: values.name,
    //        description: values.description,
    //        createdBy: user?._id!,
    //      };
    //      console.log(spaceData);
    //      const response = await createSpace(spaceData, user?._id!);
    //      console.log(response);
    //      if (response) {
    //        if (props.spaceID) {
    //          enqueueSnackbar("Espacio editado con éxito", {
    //            variant: "success",
    //          });
    //          navigate("/spaces");
    //        } else {
    //          enqueueSnackbar("Espacio creado con éxito", {
    //            variant: "success",
    //          });
    //          navigate("/spaces");
    //        }
    //      } else {
    //        enqueueSnackbar("Hubo un error", { variant: "error" });
    //      }
    //      actions.setSubmitting(true);
    //    } else {
    //      const spaceData: Space = {
    //        name: values.name,
    //        description: values.description,
    //        parentSpace: values.parentSpace!,
    //        createdBy: user?._id!,
    //      };
    //      const response = await createSubSpace(spaceData, selectedSpace?._id!);
    //      if (response) {
    //        if (props.spaceID) {
    //          enqueueSnackbar("Espacio editado con éxito", {
    //            variant: "success",
    //          });
    //          navigate("/spaces");
    //        } else {
    //          enqueueSnackbar("Espacio creado con éxito", {
    //            variant: "success",
    //          });
    //          navigate("/spaces");
    //        }
    //      } else {
    //        enqueueSnackbar("Hubo un error", { variant: "error" });
    //      }
    //      actions.setSubmitting(true);
    //    }
    //  } catch (error) {
    //    enqueueSnackbar("Hubo un error", { variant: "error" });
    //  } finally {
    //    actions.setSubmitting(false);
    //  }
  };

  const onEdit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    //  try {
    //    if (!spaceType) {
    //      const spaceDataParent: Space = {
    //        _id: values._id,
    //        name: values.name,
    //        description: values.description,
    //        createdBy: values.createdBy,
    //        createdOn: values.createdOn,
    //      };
    //      const response = await updateSpace(spaceDataParent, props.spaceID!);
    //      if (response) {
    //        enqueueSnackbar("Espacio editado con éxito", {
    //          variant: "success",
    //        });
    //        navigate("/spaces");
    //      } else {
    //        enqueueSnackbar("Hubo un error", { variant: "error" });
    //      }
    //    } else if (spaceType) {
    //      const spaceData: Space = {
    //        _id: values._id,
    //        name: values.name,
    //        description: values.description,
    //        parentSpace: selectedSpace?._id!,
    //        createdBy: values.createdBy,
    //        createdOn: values.createdOn,
    //      };
    //      const response = await updateSpace(spaceData, props.spaceID!);
    //      if (response) {
    //        enqueueSnackbar("Espacio editado con éxito", {
    //          variant: "success",
    //        });
    //        navigate("/spaces");
    //      } else {
    //        enqueueSnackbar("Hubo un error", { variant: "error" });
    //      }
    //    }
    //    actions.setSubmitting(true);
    //  } catch (error) {
    //    console.log(error);
    //  } finally {
    //    actions.setSubmitting(false);
    //  }
  };

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
              {({ isSubmitting, touched, errors, values }) => (
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
                  <Field
                    component={RadioGroup}
                    name=""
                    label="Tipo de dispositivo"
                    required
                  ></Field>
                  <Typography gutterBottom>
                    Ingrese el tópico/espacio al que pertenece el dispositivo
                  </Typography>

                  <Field
                    component={Autocomplete}
                    name="topic"
                    options={spaces}
                    getOptionLabel={(option: Space) => option.name || ""}
                    onChange={(event: any, newValue: Space) => {
                      setSelectedSpace(newValue);
                      console.log(findRoute(newValue));
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
                        getOptionLabel={(option: Space) => option.name || ""}
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
                        name="topic"
                        options={spaces}
                        getOptionLabel={(option: Space) => option.name || ""}
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
                        name="topic"
                        options={spaces}
                        getOptionLabel={(option: Space) => option.name || ""}
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
                      onClick={() => {
                        navigate("/spaces");
                      }}
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
